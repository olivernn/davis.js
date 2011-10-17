/*!
 * Davis - Route
 * Copyright (C) 2011 Oliver Nightingale
 * MIT Licensed
 */

/**
 * Scope used whilst creating the Davis.Route constructor
 * @private
 */
Davis.Route = (function () {

/**
 * RegExps for extracting path params
 * @private
 */
  var pathNameRegex = /:([\w\d]+)/g;
  var pathNameReplacement = "([^\/]+)";

/**
 * Davis.Routes are the main part of a Davis application.  They consist of a HTTP method, a path
 * and a callback function.  When a link or a form that Davis has bound to are clicked or submitted
 * a request is pushed on the history stack and a route that matches the path and method of the
 * generated request is run.
 *
 * Inside the callback function 'this' is bound to the request.
 *
 * @constructor
 * @param {String} method - This should be one of either 'get', 'post', 'put', 'delete', 'before', 'after' or 'state'
 * @param {String} path - This string can contain place holders for variables, e.g. '/user/:id'
 * @param {Function} callback - A callback that will be called when a request matching both the path and method is triggered.
 *
 * ### Example:
 *     var route = new Davis.Route ('get', '/foo/:id', function (req) {
 *       var id = req.params['id']
 *       // do something interesting!
 *     })
 */
  var Route = function (method, path, callback) {
    var convertPathToRegExp = function () {
      if (!(path instanceof RegExp)) {
        var str = path.replace(pathNameRegex, pathNameReplacement);

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
      while ((a = pathNameRegex.exec(path))) names.push(a[1]);
      return names;
    };

    this.paramNames = capturePathParamNames();
    this.path = convertPathToRegExp();
    this.method = convertMethodToRegExp();
    this.callback = callback;
  }

  Route.prototype = {

    /**
     * ## route.match
     * Tests whether or not a route matches a particular request.
     *
     * @param {String} method
     * @param {String} path
     * @returns {Boolean}
     *
     * ### Example:
     *
     *     route.match('get', '/foo/12')
     */
    match: function (method, path) {
      this.reset();
      return (this.method.test(method)) && (this.path.test(path))
    },

    /**
     * ## route.reset
     * Resets the RegExps for method and path
     */
     reset: function () {
       this.method.lastIndex = 0;
       this.path.lastIndex = 0;
     },

    /**
     * ## route.run
     * Runs the callback associated with a particular route against the passed request.
     * Any named params in the request path are extracted, as per the routes path, and
     * added onto the requests params object.
     *
     * @params {Davis.Request} request
     * @returns {Object} whatever the routes callback returns
     *
     * ### Example:
     *
     *     route.run(request)
     */
    run: function (request) {
      this.reset();
      var matches = this.path.exec(request.path);
      if (matches) {
        matches.shift();
        for (var i=0; i < matches.length; i++) {
          request.params[this.paramNames[i]] = matches[i];
        };
      };
      return this.callback.call(request, request);
    },

    /**
     * ## route.toString
     * Converts the route to a string representation of itself by combining the method and path
     * attributes.
     *
     * @returns {String} string representation of the route
     */
    toString: function () {
      return [this.method, this.path].join(' ');
    }
  };

  /**
   * exposing the constructor
   * @private
   */
  return Route;
})()