// davis.js JavaScript Routing, version: 0.5.0
// (c) 2011 Oliver Nightingale
//
//  Released under MIT license.
//
/*!
 * Davis
 * Copyright (C) 2011 Oliver Nightingale
 * MIT Licensed
 */

/**
 * Convinience method for instantiating a new Davis app and configuring it to use the passed
 * routes and subscriptions.
 *
 * @param {Function} config A function that will be run with a newly created Davis.App as its context,
 * should be used to set up app routes, subscriptions and settings etc.
 */
Davis = function (config) {
  var app = new Davis.App ();
  config.call(app);
  return app
};

/**
 * ## Davis.supported()
 * Checks whether Davis is supported in the current browser
 *
 * @returns {Boolean}
 */
Davis.supported = function () {
  return (typeof window.history.pushState == 'function')
}

/**
 * ## Davis.noop
 * A function that does nothing, used as a default param for any callbacks.
 * 
 * @private
 * @returns {Function}
 */
Davis.noop = function () {}

/**
 * ## Davis.extend
 * Method to extend the Davis library with an extension.  An extension is just a function that will modify
 * the Davis framework in some way, for example changing how the routing works or adjusting where Davis thinks
 * it is supported.
 *
 * @param {Function} the function that will extend Davis
 *
 * ### Example:
 *     Davis.extend(Davis.hashBasedRouting)
 *
 */
Davis.extend = function (extension) {
  extension(Davis)
}
/*!
 * Davis - utils
 * Copyright (C) 2011 Oliver Nightingale
 * MIT Licensed
 */

/**
 * A module that provides wrappers around modern JavaScript so that native implementations are used
 * whereever possible and JavaScript implementations are used in those browsers that do not natively
 * support them.
 */
Davis.utils = (function () {

  /**
   * ## Davis.utils.every
   * A wrapper around native Array.prototype.every that falls back to a pure JavaScript implementation
   * in browsers that do not support Array.prototype.every.  For more details see the full docs on MDC
   * https://developer.mozilla.org/en/JavaScript/Reference/Global_Objects/Array/every
   *
   * @private
   * @param {array} the array to loop through
   * @param {fn} the function to that performs the every check
   * @param {thisp} an optional param that will be set as fn's this value
   * @returns {Array}
   */
  if (Array.prototype.every) {
    var every = function (array, fn) {
      return array.every(fn, arguments[2])
    }
  } else {
    var every = function (array, fn) {
      if (array === void 0 || array === null) throw new TypeError();
      var t = Object(array);
      var len = t.length >>> 0;
      if (typeof fn !== "function") throw new TypeError();

      var thisp = arguments[2];
      for (var i = 0; i < len; i++) {
        if (i in t && !fn.call(thisp, t[i], i, t)) return false;
      }

      return true;
    }
  };

  /**
   * ## Davis.utils.forEach
   * A wrapper around native Array.prototype.forEach that falls back to a pure JavaScript implementation
   * in browsers that do not support Array.prototype.forEach.  For more details see the full docs on MDC
   * https://developer.mozilla.org/en/JavaScript/Reference/Global_Objects/Array/forEach
   *
   * @private
   * @param {array} the array to loop through
   * @param {fn} the function to apply to every element of the array
   * @param {thisp} an optional param that will be set as fn's this value
   * @returns {Array}
   */
  if (Array.prototype.forEach) {
    var forEach = function (array, fn) {
      return array.forEach(fn, arguments[2])
    }
  } else {
    var forEach = function (array, fn) {
      if (array === void 0 || array === null) throw new TypeError();
      var t = Object(array);
      var len = t.length >>> 0;
      if (typeof fn !== "function") throw new TypeError();
      

      var thisp = arguments[2];
      for (var i = 0; i < len; i++) {
        if (i in t) fn.call(thisp, t[i], i, t);
      }
    };
  };

  /**
   * ## Davis.utils.filter
   * A wrapper around native Array.prototype.filter that falls back to a pure JavaScript implementation
   * in browsers that do not support Array.prototype.filter.  For more details see the full docs on MDC
   * https://developer.mozilla.org/en/JavaScript/Reference/Global_Objects/Array/filter
   *
   * @private
   * @param {array} the array to filter
   * @param {fn} the function to do the filtering
   * @param {thisp} an optional param that will be set as fn's this value
   * @returns {Array}
   */
  if (Array.prototype.filter) {
    var filter = function (array, fn) {
      return array.filter(fn, arguments[2])
    }
  } else {
    var filter = function(array, fn) {
      if (array === void 0 || array === null) throw new TypeError();
      var t = Object(array);
      var len = t.length >>> 0;
      if (typeof fn !== "function") throw new TypeError();
      

      var res = [];
      var thisp = arguments[2];
      for (var i = 0; i < len; i++) {
        if (i in t) {
          var val = t[i]; // in case fn mutates this
          if (fn.call(thisp, val, i, t)) res.push(val);
        }
      }

      return res;
    };
  };


  /**
   * ## Davis.utils.map
   * A wrapper around native Array.prototype.map that falls back to a pure JavaScript implementation
   * in browsers that do not support Array.prototype.map.  For more details see the full docs on MDC
   * https://developer.mozilla.org/en/JavaScript/Reference/Global_Objects/Array/map
   *
   * @private
   * @param {array} the array to map through
   * @param {fn} the function to do the mapping
   * @param {thisp} an optional param that will be set as fn's this value
   * @returns {Array}
   */
  if (Array.prototype.map) {
    var map = function (array, fn) {
      return array.map(fn, arguments[2])
    }
  } else {
    var map = function(array, fn) {
      if (array === void 0 || array === null) throw new TypeError();
      var t = Object(array);
      var len = t.length >>> 0;
      if (typeof fn !== "function") throw new TypeError();
      

      var res = new Array(len);
      var thisp = arguments[2];
      for (var i = 0; i < len; i++) {
        if (i in t) res[i] = fn.call(thisp, t[i], i, t);
      }

      return res;
    };
  };

  /**
   * ## Davis.utils.toArray
   * A convinience function for converting arguments to a proper array
   *
   * @private
   * @param {args} a functions arguments
   * @param {start} an integer at which to start converting the arguments to an array
   * @returns {Array}
   */
  var toArray = function (args, start) {
    var start = start || 0
    return Array.prototype.slice.call(args, start)
  }

  /**
   * Exposing the public interface to the Utils module
   * @private
   */
  return {
    every: every,
    forEach: forEach,
    filter: filter,
    map: map,
    toArray: toArray
  }
})()


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
      var request = new Davis.Request (targetExtractor.call(jQuery(this)));
      Davis.location.assign(request)
      return false;
    };
  };

  /**
   * A handler specialized for click events.  Gets the request details from a link elem
   * @private
   */
  var clickHandler = handler(function () {
    var self = this
    return {
      method: 'get',
      fullPath: this.attr('href'),
      title: this.attr('title'),
      delegateToServer: function () {
        window.location.pathname = self.attr('href')
      }
    };
  });

  /**
   * A handler specialized for submit events.  Gets the request details from a form elem
   * @private
   */
  var submitHandler = handler(function () {
    var extractFormParams = function (form) {
      return Davis.utils.map(form.serializeArray(), function (attr) {
        return [attr.name, attr.value].join('=')
      }).join('&')
    }

    var self = this

    return {
      method: this.attr('method'),
      fullPath: [this.attr('action'), extractFormParams(this)].join("?"),
      title: this.attr('title'),
      delegateToServer: function () {
        self.submit()
      }
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
    jQuery(document).delegate(this.settings.formSelector, 'submit', submitHandler)
    jQuery(document).delegate(this.settings.linkSelector, 'click', clickHandler)
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
    jQuery(document).undelegate(this.settings.linkSelector, 'click', clickHandler)
    jQuery(document).undelegate(this.settings.formSelector, 'submit', submitHandler)
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
   *  __unsupported__ : Triggered when starting a Davis app in a browser that doesn't support html5 pushState
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
    Davis.utils.forEach(this._callbacks[eventName], function (callback) {
      callback.apply(self, Davis.utils.toArray(args, 1));
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
    var a = Davis.utils.toArray(args)
    a.unshift(timestamp())
    return a.join(' ');
  }

  /**
   * ## Davis.logger.error
   * Prints an error message to the console if the console is available.
   *
   * @params {String} All arguments are combined and logged to the console.
   */
  var error = function () {
    if (window.console) console.error(prepArgs(arguments));
  }

  /**
   * ## Davis.logger.info
   * Prints an info message to the console if the console is available.
   *
   * @params {String} All arguments are combined and logged to the console.
   */
  var info = function () {
    if (window.console) console.info(prepArgs(arguments));
  }

  /**
   * ## Davis.logger.warn
   * Prints a warning message to the console if the console is available.
   *
   * @params {String} All arguments are combined and logged to the console.
   */
  var warn = function () {
    if (window.console) console.warn(prepArgs(arguments));
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
 */
Davis.router = function () {
  var self = this

  /**
   * ## app.get, app.post, app.put
   * Generating convinience methods for creating Davis.Routes
   */
  var verbs = ['get', 'post', 'put'];
  Davis.utils.forEach(verbs, function (verb) {
    self[verb] = function (path, handler) {
      self._routeCollection.push(new Davis.Route (verb, path, handler));
    }
  })

  /**
   * ## app.del
   * delete is a reserved word in javascript so use the `del` method to
   * creating a Davis.Route with a method of delete.
   */
  this.del = function (path, handler) {
    self._routeCollection.push(new Davis.Route ('delete', path, handler))
  }

  /**
   * ## app.state
   * Adds a state route into the apps route collection.  These special kind of routes are not triggered
   * by clicking links or submitting forms, instead they are triggered manually by calling `trans`.
   *
   * Routes added using the state method act in the same way as other routes except that they generate
   * a route that is listening for requests that will not change the page location.
   *
   * @param {String} path The path for this route, this will never be seen in the url bar.
   * @param {Function} handler The handler for this route, will be called with the request that triggered the route
   *
   * ### Example
   *
   *     app.state('/foo/:id', function (req) {
   *       // will run when the app transitions into the '/foo/:id' state.
   *     })
   *
   */
  this.state = function (path, handler) {
    self._routeCollection.push(new Davis.Route('state', path, handler))
  }

  /**
   * ## app.trans
   * Transitions the app into the state identified by the passed path parameter.  This allows the app to
   * enter states without changing the page path through a link click or form submit.  If there are handlers
   * registered for this state, added by the `state` method, they will be triggered.
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
   * @param {String} path The path that represents this state.  This will not be seen in the url bar.
   * @param {Object} data Any additional data that should be sent with the request as params.
   *
   * ### Example
   *
   *     app.trans('/foo/1')
   *     
   *     app.trans('/foo/1', {
   *       "bar": "baz"
   *     })
   *     
   */
  this.trans = function (path, data) {
    if (data) {
      var fullPath = [path, decodeURIComponent($.param(data))].join('?')
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

  /**
   * Generating convinience methods for creating filters using Davis.Routes and methods to
   * lookup filters.
   */
  var filters = ['before', 'after'];
  Davis.utils.forEach(filters, function (filter) {
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
      return Davis.utils.filter(self._filterCollection[filter], function (route) {
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
    return Davis.utils.filter(this._routeCollection, function (route) {
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
   * flag to store whether or not this is the first pop state event received
   * @private
   */
  var firstPop = true;

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
        // the object that is pushed into the browser history looses its __proto__
        var obj = event.state
        obj.__proto__ = Davis.Request.prototype
        handler(obj)
      } else {
        if (!firstPop) handler(Davis.Request.forPageLoad())
      };
      firstPop = false
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
   * ## Davis.history.assign
   * Push a request onto the history stack.  This is used internally by Davis to push a new request
   * resulting from either a form submit or a link click onto the history stack, it will also trigger
   * the onpushstate event.
   *
   * @param {Davis.Request} request
   *
   * An instance of Davis.Request is expected to be passed, however any object that has a title
   * and a path property will also be accepted.
   */
  var assign = function (request) {
    history.pushState(request, request.title, request.location());
    Davis.utils.forEach(pushStateHandlers, function (handler) {
      handler(request);
    });
  };

  /**
   * ## Davis.history.replace
   * Replace the current state on the history stack.  This is used internally by Davis when performing
   * a redirect.  This will trigger an onpushstate event.
   *
   * @param {Davis.Request} request
   *
   * An instance of Davis.Request is expected to be passed, however any object that has a title
   * and a path property will also be accepted.
   */
  var replace = function (request) {
    history.replaceState(request, request.title, request.location());
    Davis.utils.forEach(pushStateHandlers, function (handler) {
      handler(request);
    });
  };


  /**
   * ## Davis.history.current
   * Returns the current location for the application.
   * Davis.location delegates to this method for getting the apps current location.
   */
  var current = function () {
    return window.location.pathname
  }

  /**
   * Exposing the public methods of this module
   * @private
   */
  return {
    onChange: onChange,
    current: current,
    assign: assign,
    replace: replace
  }
})()
/*!
 * Davis - location
 * Copyright (C) 2011 Oliver Nightingale
 * MIT Licensed
 */

/**
 * A module that acts as a delegator to any locationDelegate implementation.  This abstracts the details of
 * what is being used for the apps routing away from the rest of the library.  This allows any kind of routing
 * To be used with Davis as long as it can respond appropriatly to the given delegate methods.
 *
 * A routing module must respond to the following methods:
 *
 *  __current__ : Should return the current location for the app
 *
 *  __assign__ : Should set the current location of the app based on the location of the passed request.
 *
 *  __replace__ : Should at least change the current location to the location of the passed request, for full compatibility it should not add any extra items in the history stack.
 *
 *  __onChange__ : Should add calbacks that will be fired whenever the location is changed.
 *
 */
Davis.location = (function () {

  /**
   * By default the Davis uses the Davis.history module for its routing, this gives HTML5 based pushState routing
   * which is preferrable over location.hash based routing.
   */
  var locationDelegate = Davis.history

  /**
   * ## Davis.location.setLocationDelegate
   *
   * Used to change the location delegate.  The passed delegate will be used for all Davis apps.  The delegate
   * must respond to the following four methods `current`, `assign`, `replace` & `onChange`.
   *
   * @param {Object} the location delegate to use.
   */
  var setLocationDelegate = function (delegate) {
    locationDelegate = delegate
  }

  /**
   * ## Davis.location.current
   *
   * Delegates to the locationDelegate.current method.  This should return the current location of the app.
   */
  var current = function () {
    return locationDelegate.current()
  }

  /**
   * ## Davis.location.assign
   *
   * Delegates to the locationDelegate.assign method.  This should set the current location for the app to
   * that of the passed request object.
   *
   * @param {Request} the request to set the current location to.
   * @see Davis.Request
   */
  var assign = function (req) {
    locationDelegate.assign(req)
  }

  /**
   * ## Davis.location.replace
   *
   * Delegates to the locationDelegate.replace method.  This should replace the current location with that
   * of the passed request.  Ideally it should not create a new entry in the browsers history.
   *
   * @param {Request} the request to replace the current location with.
   * @see Davis.Request
   */
  var replace = function (req) {
    locationDelegate.replace(req)
  }

  /**
   * ## Davis.location.onChange
   *
   * Delegates to the locationDelegate.onChange method.  This should add a callback that will be called any
   * time the location changes.  The handler function will be called with a request param which is an
   * instance of Davis.Request.
   *
   * @param {Function} callback function to be called on location chnage.
   * @see Davis.Request
   *
   */
  var onChange = function (handler) {
    locationDelegate.onChange(handler)
  }

  /**
   * Exposing the public methods of this module
   * @private
   */
  return {
    setLocationDelegate: setLocationDelegate,
    current: current,
    assign: assign,
    replace: replace,
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
  this._staleCallback = function () {};

  if (this.queryString) {
    Davis.utils.forEach(this.queryString.split("&"), function (keyval) {
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

  this.method = (this.params._method || raw.method).toLowerCase();
  this.path = raw.fullPath.replace(/\?.+$/, "");
  this.delegateToServer = raw.delegateToServer || Davis.noop;
  this.isForPageLoad = raw.forPageLoad || false;

  if (Davis.Request.prev) Davis.Request.prev.makeStale(this);
  Davis.Request.prev = this;

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
  Davis.location.replace(new Davis.Request ({
    method: 'get',
    fullPath: path,
    title: this.title
  }));
};

/**
 * ## request.whenStale
 * Adds a callback to be called when the request is stale.  A request becomes stale when it is no
 * longer the current request, this normally occurs when a new request is triggered.  A request 
 * can be marked as stale manually if required.  The callback passed to whenStale will be called
 * with the new request that is making the current request stale.
 *
 * Use the whenStale callback to 'teardown' the objects required for the current route, this gives
 * a chance for views to hide themselves and unbind any event handlers etc.
 *
 * @param {Function} callback A single callback that will be called when the request becomes stale.
 *
 * ### Example:
 *     this.get('/foo', function (req) {
 *       var fooView = new FooView ()
 *       fooView.render() // display the foo view
 *       req.whenStale(function (nextReq) {
 *         fooView.remove() // stop displaying foo view and unbind any events
 *       })
 *     })
 *
 */
Davis.Request.prototype.whenStale = function (callback) {
  this._staleCallback = callback;
}

/**
 * ## request.makeStale
 * Mark the request as stale.  This will cause the whenStale callback to be called.
 *
 * @param {Davis.Request} req The next request that has been recieved.
 */
Davis.Request.prototype.makeStale = function (req) {
  this._staleCallback.call(req, req);
}

/**
 * ## request.location
 * Returns the location or path that should be pushed onto the history stack, for get requests this
 * will be the same as the path, for post, put, delete and state requests this will be blank as no
 * location should be pushed onto the history stack.
 *
 * @returns {String} string The location that the url bar should display and should be pushed onto the history stack for this request.
 */
Davis.Request.prototype.location = function () {
  return (this.method === 'get') ? this.path : ''
}

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
    // fullPath: window.location.pathname,
    fullPath: Davis.location.current(),
    title: document.title,
    forPageLoad: true
  });
}

/**
 * ## Davis.Request.prev
 * Stores the last request
 * @private
 */
Davis.Request.prev = null
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
    this.boundToInternalEvents = false;
  };

  /**
   * creating the prototype for the app from modules listener and event
   * @private
   */
  App.prototype = jQuery.extend({

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
     *       this.linkSelector = 'a.davis'
     *       this.formSelector = 'form.davis'
     *     })
     */
    configure: function (config) {
      config.call(this.settings);
    },

    /**
     * ## app.use
     * Method to include a plugin in this app.  A plugin is just a function that will be evaluated in the
     * context of the app.
     *
     * @param {Function} plugin - The plugin to use
     *
     * ### Example:
     *     app.use(Davis.title)
     *
     */
    use: function (plugin) {
      plugin.apply(this, Davis.utils.toArray(arguments, 1))
    },

    /**
     * ## app.helpers
     * Method to add helper properties to all requests in the application.  Helpers will be added to the
     * Davis.Request.prototype.  Care should be taken not to override any existing Davis.Request methods.
     *
     * @param {Object} helpers - An object containing helpers to mixin to the request
     */
    helpers: function (helpers) {
      for (property in helpers) {
        if (helpers.hasOwnProperty(property)) Davis.Request.prototype[property] = helpers[property]
      }
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
     * `throwErrors` decides whether or not any errors will be caugth by Davis.  If this is set to true
     * errors will be thrown so that the request will not be handled by JavaScript, the server will have
     * to provide a response.  When set to false errors in a route will be caught and the server will not
     * receive the request.
     *
     * `handleRouteNotFound` determines whether or not Davis should handle requests when there is no matching
     * route.  If set to false Davis will allow the request to be passed to your server to handle if no matching
     * route can be found.
     *
     * `generateRequestOnPageLoad` determines whether a request should be generated for the initial page load.
     * by default this is set to true so that a Davis.Request will be generated with the path of the current
     * page.  Setting this to false will prevent a request being passed to your app for the inital page load.
     *
     * @see #configure
     */
    settings: {
      linkSelector: 'a',
      formSelector: 'form',
      logger: Davis.logger,
      throwErrors: true,
      handleRouteNotFound: false,
      generateRequestOnPageLoad: true
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

      if (!Davis.supported()) {
        this.trigger('unsupported')
        return
      };

      var runFilterWith = function (request) {
        return function (filter) {
          var result = filter.run(request, request);
          return (typeof result === "undefined" || result);
        }
      }

      var beforeFiltersPass = function (request) {
        return Davis.utils.every(
          self.lookupBeforeFilter(request.method, request.path),
          runFilterWith(request)
        )
      }

      var handleRequest = function (request) {
        if (beforeFiltersPass(request)) {
          self.trigger('lookupRoute', request)
          var route = self.lookupRoute(request.method, request.path);
          if (route) {
            self.trigger('runRoute', request, route);

            try {
              route.run(request)
              self.trigger('routeComplete', request, route)
            } catch (error) {
              self.trigger('routeError', request, route, error)
            }

            Davis.utils.every(
              self.lookupAfterFilter(request.method, request.path),
              runFilterWith(request)
            );

          } else {
            self.trigger('routeNotFound', request);
          }
        } else {
          self.trigger('requestHalted', request)
        }
      }

      var bindToInternalEvents = function () {
        self
          .bind('runRoute', function (request) {
            self.settings.logger.info("runRoute: " + request.toString());
          })
          .bind('routeNotFound', function (request) {
            if (!self.settings.handleRouteNotFound && !request.isForPageLoad) {
              self.stop()
              request.delegateToServer()
            };
            self.settings.logger.warn("routeNotFound: " + request.toString());
          })
          .bind('start', function () {
            self.settings.logger.info("application started")
          })
          .bind('stop', function () {
            self.settings.logger.info("application stopped")
          })
          .bind('routeError', function (request, route, error) {
            if (self.settings.throwErrors) throw(error)
            self.settings.logger.error(error.message, error.stack)
          });

        Davis.location.onChange(function (req) {
          handleRequest(req)
        });

        self.boundToInternalEvents = true
      }

      if (!this.boundToInternalEvents) bindToInternalEvents()

      this.listen();
      this.trigger('start')
      this.running = true;

      if (this.settings.generateRequestOnPageLoad) handleRequest(Davis.Request.forPageLoad())

    },

    /**
     * ## app.stop
     * Stops the app listening to clicks and submits on all forms and links found using the current
     * apps settings.
     */
    stop: function () {
      this.unlisten();
      this.trigger('stop')
      this.running = false
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