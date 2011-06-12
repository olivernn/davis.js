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
 * Firstly there is nothing similar to the history.replaceState method available when using location.hash, this
 * means that doing redirects always adds a new entry in the history rather than replacing the current history
 * entry.
 *
 * Secondly it is not possible to have multiple history entries of the same location as the hashchange event
 * only fires when the hash changes to a different value.
 *
 * This extension could be used to provide a fallback for browsers that do not support the HTML5 history api,
 * however this extension does not take into account what happens when a hash link is used in a browser that
 * supports HTML5 history.
 *
 * To use this extension put this code at before starting your app.
 *
 *    Davis.extend(Davis.hashRouting)
 *
 * @plugin
 */
Davis.hashRouting = function () {

  /**
   * ## Davis.supported
   * Overwriting the supported because we are interested in the onhashchange event only now.
   */
  Davis.supported = function () {
    return ("onhashchange" in window)
  }

  /**
   * Setting the location delegate to be this hashRouting module
   */
  Davis.location.setLocationDelegate((function () {

    /**
     * Storage for callbacks
     * @private
     */
    var callbacks = []

    /**
     * ## Davis.hashRouting.current
     *
     * Returns the apps current location, which for hashRouting is pulled from the location.hash.
     * Davis.location delegates to this method for getting the apps current location.
     */
    var current = function () {
      var hash
      if (hash = window.location.hash.replace(/^#/, "")) {
        return hash
      } else {
        return "/"
      }
    }

    /**
     * ## Davis.hashRouting.assign
     *
     * Wrapper around changing the current location.hash.  This will also trigger all onChange callbacks
     * that have been registered.  Davis.location delegates to this method for setting the apps current
     * location as well as replacing the current location for the app with a new location.
     *
     * @params {Request} the request to set the current location to.
     */
    var assign = function (request) {
      if (request.location()) {
        window.location.hash = request.location()
      } else {
        callbacks.forEach(function (callback) {
          callback(request)
        })
      };
    }

    /**
     * ## Davis.hashRouting.onChange
     *
     * Adds callbacks to the hashchange event.  Davis.location delegates to this method when asinging
     * callbacks for when the apps location has changed.
     *
     * @param {Function} the callback to be fired when the location has changed.
     */
    var onChange = function (callback) {
      callbacks.push(callback)

      jQuery(window).bind('hashchange', function (e) {
        callback(new Davis.Request({
          fullPath: current(),
          method: 'get'
        }))
      })
    }

    /**
     * Exposing the public methods of this module
     * @private
     */
    return {
      current: current,
      assign: assign,
      replace: assign,
      onChange: onChange
    }
  })())
}