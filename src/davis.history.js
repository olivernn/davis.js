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
  function onPushState(handler) {
    pushStateHandlers.push(handler);
  };

  /**
   * Simple wrapper for the native onpopstate event.
   *
   * @param {Function} handler
   * @private
   */
  function onPopState(handler) {
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
  function wrapped(handler) {
    return function (event) {
      if (event.state && event.state._davis) {
        handler(new Davis.Request(event.state._davis))
      } else {
        if (!firstPop) handler(Davis.Request.forPageLoad())
      };
      firstPop = false
    }
  }

  /**
   * provide a wrapper for any data that is going to be pushed into the history stack.  All
   * data is wrapped in a "_davis" namespace.
   * @private
   */
  function wrapStateData(data) {
    return {"_davis": data}
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
  function onChange(handler) {
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
  function assign(request) {
    history.pushState(wrapStateData(request.toJSON()), request.title, request.location());
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
  function replace(request) {
    history.replaceState(wrapStateData(request.toJSON()), request.title, request.location());
    Davis.utils.forEach(pushStateHandlers, function (handler) {
      handler(request);
    });
  };


  /**
   * ## Davis.history.current
   * Returns the current location for the application.
   * Davis.location delegates to this method for getting the apps current location.
   */
  function current() {
    return window.location.pathname + (window.location.search ? window.location.search : '')
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
