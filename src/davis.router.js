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
 *     app.delete('/foo/:id', function (req) {
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
 */
Davis.router = function () {
  var self = this

  /**
   * Generating convinience methods for creating Davis.Routes
   */
  var verbs = ['get', 'post', 'put', 'delete'];
  verbs.forEach(function (verb) {
    self[verb] = function (path, handler) {
      self._routeCollection.push(new Davis.Route (verb, path, handler));
    }
  })

  /**
   * Generating convinience methods for creating filters using Davis.Routes and methods to
   * lookup filters.
   */
  var filters = ['before', 'after'];
  filters.forEach(function (filter) {
    self[filter] = function () {
      var method = /.+/;

      if (arguments.length == 1) {
        var path = /.+/;
        var handler = arguments[0];
      } else if (arguments.length == 2) {
        var path = arguments[0];
        var handler = arguments[1];
      };

      self._filterCollection[filter].push(new Davis.Route (method, path, handler));
    }

    var lookupName = 'lookup' + filter.replace(/^\w/, function ($0) { return $0.toUpperCase()}) + 'Filter';

    self[lookupName] = function (method, path) {
      return self._filterCollection[filter].filter(function (route) {
        return route.match(method, path)
      });
    }
  })

  /**
   * collections of routes and filters
   * @private
   */
  self._routeCollection = [];
  self._filterCollection = {
    before: [],
    after: []
  };

  /**
   * ## app.lookupRoute
   * Looks for the first route that matches the method and path from a request.  Will only
   * find and return the first matched route.
   *
   * @param {String} method
   * @param {String} path
   * @returns {Davis.Route} route
   */
  self.lookupRoute = function (method, path) {
    return this._routeCollection.filter(function (route) {
      return route.match(method, path)
    })[0];
  };
}