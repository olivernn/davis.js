/*!
 * Davis - Route
 * Copyright (C) 2011 Oliver Nightingale
 * MIT Licensed
 */

Davis.Route = (function () {

  var pathNameRegex = /:([\w\d]+)/g;
  var pathNameReplacement = "([^\/]+)";

  var splatNameRegex = /\*([\w\d]+)/g;
  var splatNameReplacement = "(.*)";

  var nameRegex = /[:|\*]([\w\d]+)/g

/**
 * Davis.Routes are the main part of a Davis application.  They consist of an HTTP method, a path
 * and a callback function.  When a link or a form that Davis has bound to are clicked or submitted
 * a request is pushed on the history stack and a route that matches the path and method of the
 * generated request is run.
 *
 * The path for the route can consist of placeholders for attributes, these will then be available
 * on the request.  Simple variables should be prefixed with a colan, and for splat style params use
 * an asterisk.
 *
 * Inside the callback function 'this' is bound to the request.
 *
 * Example:
 *
 *     var route = new Davis.Route ('get', '/foo/:id', function (req) {
 *       var id = req.params['id']
 *       // do something interesting!
 *     })
 *
 *     var route = new Davis.Route ('get', '/foo/*splat', function (req) {
 *       var id = req.params['splat']
 *       // splat will contain everything after the /foo/ in the path.
 *     })
 *
 * You can include any number of route level 'middleware' when defining routes.  These middlewares are
 * run in order and need to explicitly call the next handler in the stack.  Using route middleware allows
 * you to share common logic between routes and is also a good place to load any data or do any async calls
 * keeping your main handler simple and focused.
 *
 * Example:
 *
 *     var loadUser = function (req, next) {
 *       $.get('/users/current', function (user) {
 *         req.user = user
 *         next(req)
 *       })
 *     }
 *
 *     var route = new Davis.Route ('get', '/foo/:id', loadUser, function (req) {
 *       renderUser(req.user)
 *     })
 *
 * @constructor
 * @param {String} method This should be one of either 'get', 'post', 'put', 'delete', 'before', 'after' or 'state'
 * @param {String} path This string can contain place holders for variables, e.g. '/user/:id' or '/user/*splat'
 * @param {Function} callback One or more callbacks that will be called in order when a request matching both the path and method is triggered.
 */
  var Route = function (method, path, handlers) {
    var convertPathToRegExp = function () {
      if (!(path instanceof RegExp)) {
        var str = path
          .replace(pathNameRegex, pathNameReplacement)
          .replace(splatNameRegex, splatNameReplacement);

        // Most browsers will reset this to zero after a replace call.  IE will
        // set it to the index of the last matched character.
        path.lastIndex = 0;

        return new RegExp("^" + str + "$", "gi");
      } else {
        return path;
      };
    };

    var convertMethodToRegExp = function () {
      if (!(method instanceof RegExp)) {
        return new RegExp("^" + method + "$", "i");
      } else {
        return method
      };
    }

    var capturePathParamNames = function () {
      var names = [], a;
      while ((a = nameRegex.exec(path))) names.push(a[1]);
      return names;
    };

    this.paramNames = capturePathParamNames();
    this.path = convertPathToRegExp();
    this.method = convertMethodToRegExp();

    if (typeof handlers === 'function') {
      this.handlers = [handlers]
    } else {
      this.handlers = handlers;
    }
  }

  /**
   * Tests whether or not a route matches a particular request.
   *
   * Example:
   *
   *     route.match('get', '/foo/12')
   *
   * @param {String} method the method to match against
   * @param {String} path the path to match against
   * @returns {Boolean}
   */
  Route.prototype.match = function (method, path) {
    this.reset();
    return (this.method.test(method)) && (this.path.test(path))
  }

  /**
   * Resets the RegExps for method and path
   */
  Route.prototype.reset = function () {
    this.method.lastIndex = 0;
    this.path.lastIndex = 0;
  }

  /**
   * Runs the callback associated with a particular route against the passed request.
   *
   * Any named params in the request path are extracted, as per the routes path, and
   * added onto the requests params object.
   *
   * Example:
   *
   *     route.run(request)
   *
   * @params {Davis.Request} request
   * @returns {Object} whatever the routes callback returns
   */
  Route.prototype.run = function (request) {
    this.reset();
    var matches = this.path.exec(request.path);
    if (matches) {
      matches.shift();
      for (var i=0; i < matches.length; i++) {
        request.params[this.paramNames[i]] = matches[i];
      };
    };

    var handlers = Davis.utils.map(this.handlers, function (handler, i) {
      return function (req) {
        return handler.call(req, req, handlers[i+1])
      }
    })

    return handlers[0](request)
  }

  /**
   * Converts the route to a string representation of itself by combining the method and path
   * attributes.
   *
   * @returns {String} string representation of the route
   */
  Route.prototype.toString = function () {
    return [this.method, this.path].join(' ');
  }

  /*!
   * exposing the constructor
   * @private
   */
  return Route;
})()
