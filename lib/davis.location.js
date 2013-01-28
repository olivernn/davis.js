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
 * A routing module must respond to the following methods
 *
 *  * __current__ : Should return the current location for the app
 *  * __assign__ : Should set the current location of the app based on the location of the passed request.
 *  * __replace__ : Should at least change the current location to the location of the passed request, for full compatibility it should not add any extra items in the history stack.
 *  * __onChange__ : Should add calbacks that will be fired whenever the location is changed.
 *
 * @module
 *
 */
Davis.location = (function () {

  /*!
   * By default the Davis uses the Davis.history module for its routing, this gives HTML5 based pushState routing
   * which is preferrable over location.hash based routing.
   */
  var locationDelegate = Davis.history

  /**
   * Sets the current location delegate.
   *
   * The passed delegate will be used for all Davis apps.  The delegate
   * must respond to the following four methods `current`, `assign`, `replace` & `onChange`.
   *
   * @param {Object} the location delegate to use.
   * @memberOf location
   */
  function setLocationDelegate(delegate) {
    locationDelegate = delegate
  }

  /**
   * Delegates to the locationDelegate.current method.
   *
   * This should return the current location of the app.
   *
   * @memberOf location
   */
  function current() {
    return locationDelegate.current()
  }

  /*!
   * Creates a function which sends the location delegate the passed message name.
   * It handles converting a string path to an actual request
   *
   * @returns {Function} a function that calls the location delegate with the supplied method name
   * @memberOf location
   * @private
   */
  function sendLocationDelegate (methodName) {
    return function (req, opts) {
      if (typeof req == 'string') req = new Davis.Request (req)
      locationDelegate[methodName](req, opts)
    }
  }

  /**
   * Delegates to the locationDelegate.assign method.
   *
   * This should set the current location for the app to that of the passed request object.
   *
   * Can take either a Davis.Request or a string representing the path of the request to assign.
   *
   *
   *
   * @param {Request} req the request to replace the current location with, either a string or a Davis.Request.
   * @param {Object} opts the optional options object that will be passed to the location delegate
   * @see Davis.Request
   * @memberOf location
   */
  var assign = sendLocationDelegate('assign')

  /**
   * Delegates to the locationDelegate.replace method.
   *
   * This should replace the current location with that of the passed request.
   * Ideally it should not create a new entry in the browsers history.
   *
   * Can take either a Davis.Request or a string representing the path of the request to assign.
   *
   * @param {Request} req the request to replace the current location with, either a string or a Davis.Request.
   * @param {Object} opts the optional options object that will be passed to the location delegate
   * @see Davis.Request
   * @memberOf location
   */
  var replace = sendLocationDelegate('replace')

  /**
   * Delegates to the locationDelegate.onChange method.
   *
   * This should add a callback that will be called any time the location changes.
   * The handler function will be called with a request param which is an instance of Davis.Request.
   *
   * @param {Function} handler callback function to be called on location chnage.
   * @see Davis.Request
   * @memberOf location
   *
   */
  function onChange(handler) {
    locationDelegate.onChange(handler)
  }

  /*!
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
