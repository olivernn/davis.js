/*!
 * Davis - hashRouting
 * Copyright (C) 2011 Oliver Nightingale
 * MIT Licensed
 */

/**
 * Davis.hash is an extension to Davis which swaps out the HTML5 pushState based routing with a location
 * hash based approach.  It implements the delegate methods of Davis.location however it has some limitations
 * when compared with the default pushState based routing.
 *
 * It is not possible to have multiple history entries of the same location as the hashchange event only fires
 * when the hash changes to a different value.
 *
 * This extension could be used to provide a fallback for browsers that do not support the HTML5 history api,
 * however this extension does not take into account what happens when a hash link is used in a browser that
 * supports HTML5 history.
 *
 * When this extension is instantiated, the browser will be redirected to the appropriate location scheme.
 * For example, if the current URL is "http://www.example.com/foobar" but the browser doesn't support
 * the history api, it will be redirected to "http://www.example.com/#/foobar".
 *
 * If this extension is instantiated on a browser that supports the history API, then the hash routing will
 * not take effect unless the forceHashRouting option is set to true
 *
 * To use this extension put this code at before starting your app.
 *
 *    Davis.extend(Davis.hashRouting({ prefix: "!" }))
 *
 * The extention takes a number of options:
 *
 * `forceHashRouting` Setting this to true will force hash routing, even if the browser supports 
 *  the history API.  This defaults to false.
 *
 * `normalizeInitialLocation` - If this is true, then the browser will be redirected to the appropriate routing
 *  as soon as the extension is initialized.  This defaults to false.
 *
 * `prefix`. This string will be prepended to all hash locations. This defaults to ''
 *
 * `pollerInterval`. Sets the interval in milliseconds that the window.location object will be polled
 *  for changes in the hash. This is irrelevant for browsers that support the onhashchange event. 
 *  This defaults to 100.
 *
 * @plugin
 */
Davis.hashRouting = function(options) {
  if(!options)
    options = {};

  /**
    * Configuring option defaults
    */
  if(typeof(options.forceHashRouting) == 'undefined')
    options.forceHashRouting = false;

  if(typeof(options.prefix) == 'undefined')
    options.prefix = '';

  if(typeof(options.normalizeInitialLocation) == 'undefined')
    options.normalizeInitialLocation = false;

  if(typeof(options.pollerInterval) == 'undefined')
    options.pollerInterval = 100;

  if(typeof(options.forcePolling) == 'undefined')
    options.forcePolling = false;

  /**
    * options.location should be the same as window.location.  This option is
    * available for the sake of test mocking.
    */
  if(typeof(options.location) == 'undefined')
    options.location = window.location;

  /**
   * Storage for callbacks
   * @private
   */
  var callbacks = [];

  /**
   * Binds to the onhashchange event if it is available. If this event isn't support,
   * a poller will be started to monitor the hash location for changes.
   * @private
   */
  var bindHashChange = function() {
    if("onhashchange" in window && !options.forcePolling) {
      Davis.$(window).bind('hashchange', checkForLocationChange);
    } else {
      setTimeout(locationPoller, options.pollerInterval);
    }
  };

  var invokeCallbacks = function(request) {
    Davis.utils.forEach(callbacks, function (callback) {
      callback(request);
    });
  };

  /**
   * ## Davis.hashRouting.onChange
   *
   * Adds callbacks to the hashchange event.  Davis.location delegates to this method when asinging
   * callbacks for when the apps location has changed.
   *
   * @param {Function} the callback to be fired when the location has changed.
   */
  var onChange = function(handler) {
    callbacks.push(handler);
  };

  var hashLocationPattern = new RegExp("#" + options.prefix + "(.*)$")

  /**
   * ## Davis.hashRouting.current
   *
   * Returns the apps current location, which for hashRouting is pulled from the location.hash.
   * Davis.location delegates to this method for getting the apps current location.
   */
  var current = function() {
    var match = options.location.hash.match(hashLocationPattern);
    if(match)
      return match[1];
    else
      return '/';
  };

  var onHashChange = function() {
    var path = current();

    if(path) {
      invokeCallbacks( new Davis.Request({
          fullPath: path,
          method: "get"
        })
      );
    }
  };

  /**
   * ## normalize
   *
   * Give the hash and non-hash parts of a location, this returns a URL
   * that will fit into the current routing schema.
   *
   * @private
   */
  var normalize = function(usingHashRouting, hashLocation, normalLocation) {
    if(hashLocation && hashLocation != '/') {
      if(usingHashRouting) {
        if(normalLocation != '/') {
          /*
            URL looks like:          http://www.example.com/foo#!/bar
            We want it to look like: http://www.example.com/#!/bar
          */
          return "/#" + options.prefix + hashLocation;
        }
      } else {
        /*
          URL looks like:          http://www.example.com/foo#!/bar
          We want it to look like: http://www.example.com/bar
        */
        return hashLocation;
      }
    } else {
      if(usingHashRouting && normalLocation != '/') {
        /*
          URL looks like:          http://www.example.com/foo
          We want it to look like: http://www.example.com/#!/foo
        */
        return "/#" + options.prefix + normalLocation;
      }
    }

    /* URL is find the way it is.  Don't forward anywhere */
    return null;
  };

  /**
    * On browsers that don't support the onhashchange event, we poll
    * window.location to detect a change
    */
  getLocation = function() {
    return options.location.hash;
  };
  var lastPolledLocation = getLocation();
  var checkForLocationChange = function() {
    if(lastPolledLocation != getLocation()) {
      lastPolledLocation = getLocation();
      onHashChange();
    }
  };

  var locationPoller = function() {
    checkForLocationChange();
    setTimeout(locationPoller, options.pollerInterval);
  };

  /**
   * ## Davis.hashRouting.assign and replace
   *
   * Wrapper around location.assign and location.replace.  This will also trigger all onChange callbacks
   * that have been registered.  Davis.location delegates to this method for setting the apps current
   * location as well as replacing the current location for the app with a new location.
   *
   * @params {Request} the request to set the current location to.
   */
  var wrapper = function(request, opts, setter) {
    setter("#" + options.prefix + request.location());
    lastPolledLocation = getLocation();
    if (opts && opts.silent) return
    invokeCallbacks(request);
  };

  var assign = function(request, opts) {
    wrapper(request, (opts || false), function(string) {
      // IE does not allow you to use call or apply on location.replace or location.assign.
      // Keep this in mind if refactoring.
      options.location.assign(string);
    });
  };

  var replace = function(request, opts) {
    wrapper(request, (opts || false), function(string) {
      options.location.replace(string);
    });
  };

  return function(Davis) {
    /*
     * By default, don't enable this extension if the browser supports the history api. 
     */
    var usingHashRouting = !Davis.supported() || options.forceHashRouting;

    /*
     * Forward the web browser to a normalized version of the current URL, if necessary.
     */
    if(options.normalizeInitialLocation) {
      normalizedLocation = normalize(usingHashRouting, current(), options.location.pathname);
      if(normalizedLocation) {
        options.location.replace(normalizedLocation);
      }
    }

    if(!usingHashRouting)
      return;

    /**
     * ## Davis.supported
     * Overwriting supported because this extension will support any browser.
     */
    Davis.supported = function () { return true; }

    Davis.location.setLocationDelegate({
      assign: assign,
      current: current,
      replace: replace,
      onChange: onChange
    });

    bindHashChange();
  }
};