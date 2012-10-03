/*!
 * Davis - router
 * Copyright (C) 2011 Oliver Nightingale
 * MIT Licensed
 */

/**
 * A decorator that adds convinience methods to a Davis.App for easily creating instances
 * of Davis.Route and looking up routes for a particular request.
 *
 * Provides get, post put and delete method shortcuts for creating instances of Davis.Routes
 * with the corresponding method.  This allows simple REST styled routing for a client side
 * JavaScript application.
 *
 * ### Example
 *
 *     app.get('/foo/:id', function (req) {
 *       // get the foo with id = req.params['id']
 *     })
 *     
 *     app.post('/foo', function (req) {
 *       // create a new instance of foo with req.params
 *     })
 *     
 *     app.put('/foo/:id', function (req) {
 *       // update the instance of foo with id = req.params['id']
 *     })
 *     
 *     app.del('/foo/:id', function (req) {
 *       // delete the instance of foo with id = req.params['id']
 *     })
 *
 * As well as providing convinience methods for creating instances of Davis.Routes the router
 * also provides methods for creating special instances of routes called filters.  Before filters
 * run before any matching route is run, and after filters run after any matched route has run.
 * A before filter can return false to halt the running of any matched routes or other before filters.
 *
 * A filter can take an optional path to match on, or without a path will match every request.
 *
 * ### Example
 *
 *     app.before('/foo/:id', function (req) {
 *       // will only run before request matching '/foo/:id'
 *     })
 *     
 *     app.before(function (req) {
 *       // will run before all routes
 *     })
 *     
 *     app.after('/foo/:id', function (req) {
 *       // will only run after routes matching '/foo/:id'
 *     })
 *     
 *     app.after(function (req) {
 *       // will run after all routes
 *     })
 *
 * Another special kind of route, called state routes, are also generated using the router.  State routes
 * are for requests that will not change the current page location.  Instead the page location will remain
 * the same but the current state of the page has changed.  This allows for states which the server will not
 * be expected to know about and support.
 *
 * ### Example
 *
 *     app.state('/foo/:id', function (req) {
 *       // will run when the app transitions into the '/foo/:id' state.
 *     })
 *
 * Using the `trans` method an app can transition to these kind of states without changing the url location.
 *
 * For convinience routes can be defined within a common base scope, this is useful for keeping your route
 * definitions simpler and DRYer.  A scope can either cover the whole app, or just a subset of the routes.
 *
 * ### Example
 *
 *     app.scope('/foo', function () {
 *       this.get('/:id', function () {
 *         // will run for routes that match '/foo/:id'
 *       })
 *     })
 *
 * @module
 */
Davis.router = function () {

  /**
   * Low level method for adding routes to your application.
   *
   * If called with just a method will return a partially applied function that can create routes with
   * that method.  This is used internally to provide shortcuts for get, post, put, delete and state
   * routes.
   *
   * You normally want to use the higher level methods such as get and post, but this can be useful for extending
   * Davis to work with other kinds of requests.
   *
   * Example:
   *
   *     app.route('get', '/foo', function (req) {
   *       // will run when a get request is made to '/foo'
   *     })
   *
   *     app.patch = app.route('patch') // will return a function that can be used to handle requests with method of patch.
   *     app.patch('/bar', function (req) {
   *       // will run when a patch request is made to '/bar'
   *     })
   *
   * @param {String} method The method for this route.
   * @param {String} path The path for this route.
   * @param {Function} handler The handler for this route, will be called with the request that triggered the route.
   * @returns {Davis.Route} the route that has just been created and added to the route list.
   * @memberOf router
   */
  this.route = function (method, path) {
    var createRoute = function (path) {
      var handlers = Davis.utils.toArray(arguments, 1),
          scope = scopePaths.join(''),
          fullPath, route

      (typeof path == 'string') ? fullPath = scope + path : fullPath = path

      route = new Davis.Route (method, fullPath, handlers)

      routeCollection.push(route)
      return route
    }

    return (arguments.length == 1) ? createRoute : createRoute.apply(this, Davis.utils.toArray(arguments, 1))
  }

  /**
   * A convinience wrapper around `app.route` for creating get routes.
   *
   * @param {String} path The path for this route.
   * @param {Function} handler The handler for this route, will be called with the request that triggered the route.
   * @returns {Davis.Route} the route that has just been created and added to the route list.
   * @see Davis.router.route
   * @memberOf router
   */
  this.get  = this.route('get')

  /**
   * A convinience wrapper around `app.route` for creating post routes.
   *
   * @param {String} path The path for this route.
   * @param {Function} handler The handler for this route, will be called with the request that triggered the route.
   * @returns {Davis.Route} the route that has just been created and added to the route list.
   * @see Davis.router.route
   * @memberOf router
   */
  this.post = this.route('post')

  /**
   * A convinience wrapper around `app.route` for creating put routes.
   *
   * @param {String} path The path for this route.
   * @param {Function} handler The handler for this route, will be called with the request that triggered the route.
   * @returns {Davis.Route} the route that has just been created and added to the route list.
   * @see Davis.router.route
   * @memberOf router
   */
  this.put  = this.route('put')

  /**
   * A convinience wrapper around `app.route` for creating delete routes.
   *
   * delete is a reserved word in javascript so use the `del` method when creating a Davis.Route with a method of delete.
   *
   * @param {String} path The path for this route.
   * @param {Function} handler The handler for this route, will be called with the request that triggered the route.
   * @returns {Davis.Route} the route that has just been created and added to the route list.
   * @see Davis.router.route
   * @memberOf router
   */
  this.del  = this.route('delete')

  /**
   * Adds a state route into the apps route collection.
   *
   * These special kind of routes are not triggered by clicking links or submitting forms, instead they
   * are triggered manually by calling `trans`.
   *
   * Routes added using the state method act in the same way as other routes except that they generate
   * a route that is listening for requests that will not change the page location.
   *
   * Example:
   *
   *     app.state('/foo/:id', function (req) {
   *       // will run when the app transitions into the '/foo/:id' state.
   *     })
   *
   * @param {String} path The path for this route, this will never be seen in the url bar.
   * @param {Function} handler The handler for this route, will be called with the request that triggered the route
   * @memberOf router
   *
   */
  this.state = this.route('state');

  /**
   * Modifies the scope of the router.
   *
   * If you have many routes that share a common path prefix you can use scope to reduce repeating
   * that path prefix.
   *
   * You can use `scope` in two ways, firstly you can set the scope for the whole app by calling scope
   * before defining routes.  You can also provide a function to the scope method, and the scope will
   * only apply to those routes defined within this function. It is  also possible to nest scopes within
   * other scopes.
   *
   * Example
   *
   *     // using scope with a function
   *     app.scope('/foo', function () {
   *       this.get('/bar', function (req) {
   *         // this route will have a path of '/foo/bar'
   *       })
   *     })
   *
   *     // setting a global scope for the rest of the application
   *     app.scope('/bar')
   *
   *     // using scope with a function
   *     app.scope('/foo', function () {
   *       this.scope('/bar', function () {
   *         this.get('/baz', function (req) {
   *           // this route will have a path of '/foo/bar/baz'
   *         })
   *       })
   *     })
   *
   * @memberOf router
   * @param {String} path The prefix to use as the scope
   * @param {Function} fn A function that will be executed with the router as its context and the path
   * as a prefix
   *
   */
  this.scope = function (path, fn) {
    scopePaths.push(path)
    if (arguments.length == 1) return

    fn.call(this, this)
    scopePaths.pop()
  }

  /**
   * Transitions the app into the state identified by the passed path parameter.
   *
   * This allows the app to enter states without changing the page path through a link click or form submit. 
   * If there are handlers registered for this state, added by the `state` method, they will be triggered.
   *
   * This method generates a request with a method of 'state', in all other ways this request is identical
   * to those that are generated when clicking links etc.
   *
   * States transitioned to using this method will not be able to be revisited directly with a page load as
   * there is no url that represents the state.
   *
   * An optional second parameter can be passed which will be available to any handlers in the requests
   * params object.
   *
   * Example
   *
   *     app.trans('/foo/1')
   *     
   *     app.trans('/foo/1', {
   *       "bar": "baz"
   *     })
   *     
   *
   * @param {String} path The path that represents this state.  This will not be seen in the url bar.
   * @param {Object} data Any additional data that should be sent with the request as params.
   * @memberOf router
   */
  this.trans = function (path, data) {
    if (data) {
      var fullPath = [path, decodeURIComponent(Davis.$.param(data))].join('?')
    } else {
      var fullPath = path
    };

    var req = new Davis.Request({
      method: 'state',
      fullPath: fullPath,
      title: ''
    })

    Davis.location.assign(req)
  }

  /*!
   * Generating convinience methods for creating filters using Davis.Routes and methods to
   * lookup filters.
   */
  this.filter = function (filterName) {
    return function () {
      var method = /.+/;

      if (arguments.length == 1) {
        var path = /.+/;
        var handler = arguments[0];
      } else if (arguments.length == 2) {
        var path = scopePaths.join('') + arguments[0];
        var handler = arguments[1];
      };

      var route = new Davis.Route (method, path, handler)
      filterCollection[filterName].push(route);
      return route
    }
  }

  this.lookupFilter = function (filterType) {
    return function (method, path) {
      return Davis.utils.filter(filterCollection[filterType], function (route) {
        return route.match(method, path)
      });
    }
  }

  /**
   * A convinience wrapper around `app.filter` for creating before filters.
   *
   * @param {String} path The optionl path for this filter.
   * @param {Function} handler The handler for this filter, will be called with the request that triggered the route.
   * @returns {Davis.Route} the route that has just been created and added to the route list.
   * @memberOf router
   */
  this.before = this.filter('before')

  /**
   * A convinience wrapper around `app.filter` for creating after filters.
   *
   * @param {String} path The optionl path for this filter.
   * @param {Function} handler The handler for this filter, will be called with the request that triggered the route.
   * @returns {Davis.Route} the route that has just been created and added to the route list.
   * @memberOf router
   */
  this.after = this.filter('after')

  /**
   * A convinience wrapper around `app.lookupFilter` for looking up before filters.
   *
   * @param {String} path The optionl path for this filter.
   * @param {Function} handler The handler for this filter, will be called with the request that triggered the route.
   * @returns {Davis.Route} the route that has just been created and added to the route list.
   * @memberOf router
   */
  this.lookupBeforeFilter = this.lookupFilter('before')

  /**
   * A convinience wrapper around `app.lookupFilter` for looking up after filters.
   *
   * @param {String} path The optionl path for this filter.
   * @param {Function} handler The handler for this filter, will be called with the request that triggered the route.
   * @returns {Davis.Route} the route that has just been created and added to the route list.
   * @memberOf router
   */
  this.lookupAfterFilter  = this.lookupFilter('after')

  /*!
   * collections of routes and filters
   * @private
   */
  var routeCollection = [];
  var filterCollection = {
    before: [],
    after: []
  };
  var scopePaths = []

  /**
   * Looks for the first route that matches the method and path from a request.
   * Will only find and return the first matched route.
   *
   * @param {String} method the method to use when looking up a route
   * @param {String} path the path to use when looking up a route
   * @returns {Davis.Route} route
   * @memberOf router
   */
  this.lookupRoute = function (method, path) {
    return Davis.utils.filter(routeCollection, function (route) {
      return route.match(method, path)
    })[0];
  };
}
