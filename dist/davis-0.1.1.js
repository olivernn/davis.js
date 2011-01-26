// davis.js JavaScript Routing, version: 0.1.1
// (c) 2011 Oliver Nightingale
//
//  Released under MIT license.
//
Davis = function (routes) {
  var app = new Davis.App ();
  routes.call(app);
  return app
};
/*!
 * Davis - listener
 * Copyright (C) 2011 Oliver Nightingale
 * MIT Licensed
 */

/**
 * A module to bind to link clicks and form submits and turn what would normally be http requests
 * into instances of Davis.Request.  These request objects are then pushed onto the history stack
 * using the Davis.history module.
 *
 * This module requires jQuery for its event binding and event object normalization.  To use Davis
 * with any, or no, JavaScript framework this module should be replaced with one using your framework
 * of choice.
 */
Davis.listener = (function () {

  /**
   * A handler that creates a new Davis.Request and pushes it onto the history stack using Davis.history.
   * 
   * @param {Function} targetExtractor a function that will be called with the event target jQuery object and should return an object with path, title and method.
   * @private
   */
  var handler = function (targetExtractor) {
    return function (event) {
      var request = new Davis.Request (targetExtractor.call($(event.target)));
      Davis.history.pushState(request);
      return false;
    };
  };

  /**
   * A handler specialized for click events.  Gets the request details from a link elem
   * @private
   */
  var clickHandler = handler(function () {
    return {
      method: 'get',
      fullPath: this.attr('href'),
      title: this.attr('title')
    };
  });

  /**
   * A handler specialized for submit events.  Gets the request details from a form elem
   * @private
   */
  var submitHandler = handler(function () {
    var extractFormParams = function (form) {
      return form.serializeArray().map(function (attr) {
        return [attr.name, attr.value].join('=')
      }).join('&')
    }

    return {
      method: this.attr('method'),
      fullPath: [this.attr('action'), extractFormParams(this)].join("?"),
      title: this.attr('title')
    };
  });

  /**
   * ## app.listen
   * Binds to both link clicks and form submits using jQuery's deleagate.  Will catch all current
   * and future links and forms.  Uses the apps settings for the selector to use for links and forms
   * 
   * @see Davis.App.settings
   */
  var listen = function () {
    $(document).delegate(this.settings.formSelector, 'submit', submitHandler)
    $(document).delegate(this.settings.linkSelector, 'click', clickHandler)
  }

  /**
   * ## app.unlisten
   * Unbinds all click and submit handlers that were attatched with listen.  Will efectivley stop
   * the current app from processing any requests and all links and forms will have their default
   * behaviour restored.
   *
   * @see Davis.App.settings
   */
  var unlisten = function () {
    $(document).undelegate(this.settings.linkSelector, 'click', clickHandler)
    $(document).undelegate(this.settings.formSelector, 'submit', submitHandler)
  }

  /**
   * exposing the public methods of the module
   * @private
   */
  return {
    listen: listen,
    unlisten: unlisten
  }
})()
/*!
 * Davis - event
 * Copyright (C) 2011 Oliver Nightingale
 * MIT Licensed
 */

/**
 * A module that can be mixed into any object to provide basic event functionality.
 * This module is mixed into the prototype of Davis.App.
 */
Davis.event = {

  /**
   * an object used for storing event callbacks
   * @private
   */
  _callbacks: {},

  /**
   * ## app.bind
   * Binds a callback to a named event.
   *
   * @param {String} eventName
   * @param {Function} callback
   *
   * The callback will be called with its context set to which ever object this module
   * has been mixed into.  Any data that is passed when triggering the event will be passed
   * to the callback function as the first parameter.
   *
   * The following events are triggered internally by Davis and can be bound to:
   *
   *  __start__ : Triggered when the application is started
   *
   *  __lookupRoute__ : Triggered before looking up a route, the request being looked up is passed as an argument
   *
   *  __runRoute__ : Triggered before running a route, the request and route being run are passed as arguments
   *
   *  __routeNotFound__ : Triggered if no route for the current request can be found, the current request is passed as an arugment
   *
   *  __requestHalted__ : Triggered when a before filter halts the current request, the current request is passed as an argument
   *
   * ### Example:
   *     app.bind('runRoute', function () {
   *       console.log('just about to run a route!')
   *     })
   */
  bind: function (eventName, callback) {
    if (!this._callbacks[eventName]) this._callbacks[eventName] = [];
    this._callbacks[eventName].push(callback);
    return this;
  },
  /**
   * ## app.trigger
   * Triggers an event on the current object.
   *
   * @param {String} eventName
   * @param {Object} data (optional)
   *
   * Triggers an event on the current object, all callbacks bound using bind will be called.
   * An optional second param can be passed which will be passed as an argument to each callback
   * bound to the named event.
   *
   * ### Example:
   *     app.triger('foo')
   *     app.trigger('bar', {baz: true})
   */
  trigger: function (eventName) {
    var self = this;
    var args = arguments;
    if (!this._callbacks[eventName]) this._callbacks[eventName] = [];
    this._callbacks[eventName].forEach(function (callback) {
      callback.apply(self, Array.prototype.slice.call(args, 1));
    }) 
    return this;
  }
};


/*!
 * Davis - logger
 * Copyright (C) 2011 Oliver Nightingale
 * MIT Licensed
 */

/**
 * A module for enhancing the standard logging available through the console object.
 * Used internally in Davis and available for use outside of Davis.
 *
 * Generates log messages of varying severity in the format:
 *
 * `[Sun Jan 23 2011 16:15:21 GMT+0000 (GMT)] <message>`
 */
Davis.logger = (function () {

  /**
   * Generating the timestamp portion of the log message
   * @private
   */
  var timestamp = function (){
    return "[" + Date() + "]";
  }

  /**
   * Pushing the timestamp onto the front of the arguments to log
   * @private
   */
  var prepArgs = function (args) {
    var a = Array.prototype.slice.call(args)
    a.unshift(timestamp())
    return a
  }

  /**
   * ## Davis.logger.error
   * Prints an error message to the console if the console is available.
   *
   * @params {String} All arguments are combined and logged to the console.
   */
  var error = function () {
    if (window.console) console.error.apply(console, prepArgs(arguments))
  }

  /**
   * ## Davis.logger.info
   * Prints an info message to the console if the console is available.
   *
   * @params {String} All arguments are combined and logged to the console.
   */
  var info = function () {
    if (window.console) console.info.apply(console, prepArgs(arguments))
  }

  /**
   * ## Davis.logger.warn
   * Prints a warning message to the console if the console is available.
   *
   * @params {String} All arguments are combined and logged to the console.
   */
  var warn = function () {
    if (window.console) console.warn.apply(console, prepArgs(arguments))
  }

  /**
   * Exposes the public methods of the module
   * @private
   */
  return {
    error: error,
    info: info,
    warn: warn
  }
})()
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
 * @param {String} method - This should be one of either 'get', 'post', 'put' or 'delete'
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
        return new RegExp("^" + path.replace(pathNameRegex, pathNameReplacement) + "$", "g");
      } else {
        return path;
      };
    };

    var convertMethodToRegExp = function () {
      if (!(method instanceof RegExp)) {
        return new RegExp("^" + method + "$");
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
 */
Davis.router = function () {
  var self = this

  /**
   * Generating convinience methods for creating Davis.Routes
   */
  var verbs = ['get', 'post', 'put'];
  verbs.forEach(function (verb) {
    self[verb] = function (path, handler) {
      self._routeCollection.push(new Davis.Route (verb, path, handler));
    }
  })

  /**
   * delete is a reserved word in javascript so use the `del` method to
   * creating a Davis.Route with a method of delete.
   */
  this.del = function (path, handler) {
    self._routeCollection.push(new Davis.Route ('delete', path, handler))
  }

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
/*!
 * Davis - history
 * Copyright (C) 2011 Oliver Nightingale
 * MIT Licensed
 */

/**
 * A module to normalize and enhance the window.pushState method and window.onpopstate event.
 * Adds the ability to bind to whenever a new state is pushed onto the history stack and normalizes
 * both of these events into an onChange event.
 */
Davis.history = (function () {

  /**
   * storage for the push state handlers
   * @private
   */
  var pushStateHandlers = [];

  /**
   * Add a handler to the push state event.  This event is not a native event but is fired
   * every time a call to pushState is called.
   * 
   * @param {Function} handler
   * @private
   */
  var onPushState = function (handler) {
    pushStateHandlers.push(handler);
  };

  /**
   * Simple wrapper for the native onpopstate event.
   *
   * @param {Function} handler
   * @private
   */
  var onPopState = function (handler) {
    window.addEventListener('popstate', handler, true);
  };

  /**
   * returns a handler that wraps the native event given onpopstate.
   * When the page first loads or going back to a time in the history that was not added
   * by pushState the event.state object will be null.  This generates a request for the current
   * location in those cases
   *
   * @param {Function} handler
   * @private
   */
  var wrapped = function (handler) {
    return function (event) {
      if (event.state) {
        // the request that is pushed into the browser history looses its __proto__
        var req = event.state
        req.__proto__ = Davis.Request.prototype
        handler(req)
      } else {
        handler(Davis.Request.forPageLoad())
      };
    }
  }

  /**
   * ## Davis.history.onChange
   * Bind to the history on change event.  This is not a native event but is fired any time a new
   * state is pushed onto the history stack, the current history is replaced or a state is popped
   * off the history stack.
   *
   * @param {Function} handler
   *
   * The handler function will be called with a request param which is an instance of Davis.Request.
   * @see Davis.Request
   */
  var onChange = function (handler) {
    onPushState(handler);
    onPopState(wrapped(handler));
  };

  /**
   * ## Davis.history.pushState
   * Push a request onto the history stack.  This is used internally by Davis to push a new request
   * resulting from either a form submit or a link click onto the history stack, it will also trigger
   * the onpushstate event.
   *
   * @param {Davis.Request} request
   *
   * An instance of Davis.Request is expected to be passed, however any object that has a title
   * and a path property will also be accepted.
   */
  var pushState = function (request) {
    history.pushState(request, request.title, request.path);
    pushStateHandlers.forEach(function (handler) {
      handler(request);
    });
  };

  /**
   * ## Davis.history.replaceState
   * Replace the current state on the history stack.  This is used internally by Davis when performing
   * a redirect.  This will trigger an onpushstate event.
   *
   * @param {Davis.Request} request
   *
   * An instance of Davis.Request is expected to be passed, however any object that has a title
   * and a path property will also be accepted.
   */
  var replaceState = function (request) {
    history.replaceState(request, request.title, request.path);
    pushStateHandlers.forEach(function (handler) {
      handler(request);
    });
  };

  /**
   * Exposing the public methods of this module
   * @private
   */
  return {
    replaceState: replaceState,
    pushState: pushState,
    onChange: onChange
  }
})()
/*!
 * Davis - Request
 * Copyright (C) 2011 Oliver Nightingale
 * MIT Licensed
 */

/**
 * Daivs.Requests are created from click and submit events.  Davis.Requests are passed to Davis.Routes
 * and are stored in the history stack.  They are instantiated by the Davis.listener module.
 *
 * A request will have a params object which will contain all query params and form params, any named
 * params in a routes path will also be added to the requests params object.  Also included is support
 * for rails style nested form params.
 *
 * By default the request method will be taken from the method attribute for forms or will be defaulted
 * to 'get' for links, however there is support for using a hidden field called _method in your forms
 * to set the correct reqeust method.
 *
 * @constructor
 * @param {Object} raw An object that at least contains a title, fullPath and method proprty.
 *
 * ### Example:
 *     var request = new Davis.Request({
 *       title: "foo",
 *       fullPath: "/foo/12",
 *       method: "get"
 *     })
 */
Davis.Request = function (raw) {
  var self = this;
  this.params = {};
  this.title = raw.title;
  this.queryString = raw.fullPath.split("?")[1];

  if (this.queryString) {
    this.queryString.split("&").forEach(function (keyval) {
      var paramName = keyval.split("=")[0],
          paramValue = keyval.split("=")[1],
          nestedParamRegex = /^(\w+)\[(\w+)\]/,
          nested;

      if (nested = nestedParamRegex.exec(paramName)) {
        var paramParent = nested[1];
        var paramName = nested[2];
        var parentParams = self.params[paramParent] || {};
        parentParams[paramName] = paramValue;
        self.params[paramParent] = parentParams;
      } else {
        self.params[paramName] = paramValue;
      };

    });
  };

  this.method = this.params._method || raw.method;
  this.path = raw.fullPath.replace(/\?.+$/, "");
};

/**
 * ## request.redirect
 * Redirects the current request to a new location.  Calling redirect on an instance of
 * Davis.Request will create a new request using the path and title of the current request.
 * Redirected requests always have a method of 'get'
 *
 * The request created will replace the current request in the history stack.  Redirect is most
 * often useful inside a handler for a form submit.  After succesfully handling the form the app
 * can redirect to another path.  This means that the current form will not be re-submitted if
 * navigating through the history with the back or forward buttons because the request that the
 * submit generated has been replaced in the history stack.
 *
 * @param {String} path The path to redirect the current request to
 *
 * ### Example:
 *     this.post('/foo', function (req) {
 *       processFormRequest(req.params)  // do something with the form request
 *       req.redirect('/bar');
 *     })
 */
Davis.Request.prototype.redirect = function (path) {
  Davis.history.replaceState(new Davis.Request ({
    method: 'get',
    fullPath: path,
    title: this.title
  }));
};

/**
 * ## request.toString
 * Converts the request to a string representation of itself by combining the method and path
 * attributes.
 *
 * @returns {String} string representation of the request
 */
Davis.Request.prototype.toString = function () {
  return [this.method.toUpperCase(), this.path].join(" ")
};

/**
 * ## Davis.Request.forPageLoad
 * Creates a new request for the page on page load.
 * This is required because usually requests are generated from clicking links or submitting forms
 * however this doesn't happen on a page load but should still be considered a request that the 
 * JavaScript app should handle.
 *
 * @returns {Davis.Request} A request representing the current page loading.
 */
Davis.Request.forPageLoad = function () {
  return new this ({
    method: 'get',
    fullPath: window.location.pathname,
    title: document.title
  });
}
/*!
 * Davis - App
 * Copyright (C) 2011 Oliver Nightingale
 * MIT Licensed
 */

/**
 * A private scope for the Davis.App constructor
 * @private
 */
Davis.App = (function () {

  /**
   * counter for the apps created used in creating a uniqueish id for this app
   * @private
   */
  var appCounter = 0;

  /**
   * Constructor for Davis.App
   * @constructor
   * @returns {Davis.App}
   */
  var App = function () {
    this.id = [new Date().valueOf(), appCounter++].join("-");
    this.running = false;
  };

  /**
   * creating the prototype for the app from modules listener and event
   * @private
   */
  App.prototype = $.extend({

    /**
     * ## app.configure
     * A convinience function for changing the apps default settings.
     * Should be used before starting the app to ensure any new settings
     * are picked up and used.
     *
     * @param {Function} config - This function will be executed with the context bound to the apps setting object
     *
     * ### Example:
     *     app.configure(function () {
     *       this.linkSelector: 'a.davis'
     *       this.formSelector: 'form.davis'
     *     })
     */
    configure: function (config) {
      config.call(this.settings);
    },

    /**
     * ## app.settings
     * Settings for the app.  These may be overriden directly or by using the configure
     * convinience method.
     *
     * `linkSelector` is the jquery selector for all the links on the page that you want
     * Davis to respond to.  These links will not trigger a normal http request.
     *
     * `formSelector` is similar to link selector but for all the forms that davis will bind to
     *
     * `logger` is the object that the app will use to log through.
     *
     * @see #configure
     */
    settings: {
      linkSelector: 'a',
      formSelector: 'form',
      logger: Davis.logger
    },

    /**
     * ## app.start
     * Once the app's routes have been defined and any additional configuration has happened the 
     * start method should be called.
     *
     * Starting the app binds all links and forms, so clicks and submits
     * create Davis requests that will be pushed onto the browsers history stack.  Browser history change
     * events will be picked up and the request that caused the change will be matched against the apps
     * routes and filters.
     */
    start: function () {
      var self = this;

      var runFilterWith = function (request) {
        return function (filter) {
          var result = filter.run(request, request);
          return (typeof result === "undefined" || result);
        }
      }

      var beforeFiltersPass = function (request) {
        return self.lookupBeforeFilter(request.method, request.path)
                      .every(runFilterWith(request))
      }

      var handleRequest = function (request) {
        if (beforeFiltersPass(request)) {
          self.trigger('lookupRoute', request)
          var route = self.lookupRoute(request.method, request.path);
          if (route) {
            self.trigger('runRoute', request, route);
            route.run(request);
            self.lookupAfterFilter(request.method, request.path)
                  .every(runFilterWith(request));
          } else {
            self.trigger('routeNotFound', request);
          }
        } else {
          self.trigger('requestHalted', request)
        }
      }

      Davis.history.onChange(handleRequest);

      this
        .bind('runRoute', function (request) {
          self.settings.logger.info("runRoute: " + request.toString());
        })
        .bind('routeNotFound', function (request) {
          self.settings.logger.warn("routeNotFound: " + request.toString());
        })
        .bind('start', function () {
          self.settings.logger.info("application started")
        });

      this.listen();
      this.trigger('start')
      this.running = true;

      handleRequest(Davis.Request.forPageLoad())

    },

    /**
     * ## app.stop
     * Stops the app listening to clicks and submits on all forms and links found using the current
     * apps settings.
     */
    stop: function () {
      this.unlisten();
      this.trigger('stop')
    }

  /**
   * including listener and event modules
   * @private
   */
  }, Davis.listener, Davis.event);

  /**
   * decorate the prototype with routing methods
   * @private
   */
  Davis.router.call(App.prototype)

  return App;
})()