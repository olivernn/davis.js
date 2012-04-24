/*!
 * Davis - event
 * Copyright (C) 2011 Oliver Nightingale
 * MIT Licensed
 */

 /**
  * A plugin that adds basic event capabilities to a Davis app, it is included by default.
  *
  * @module
  */
Davis.event = function () {

  /*!
   * callback storage
   */
  var callbacks = {}

  /**
   * Binds a callback to a named event.
   *
   * The following events are triggered internally by Davis and can be bound to
   *
   *  * start : Triggered when the application is started
   *  * lookupRoute : Triggered before looking up a route. The request being looked up is passed as an argument
   *  * runRoute : Triggered before running a route. The request and route being run are passed as arguments
   *  * routeNotFound : Triggered if no route for the current request can be found. The current request is passed as an arugment
   *  * requestHalted : Triggered when a before filter halts the current request. The current request is passed as an argument
   *  * unsupported : Triggered when starting a Davis app in a browser that doesn't support html5 pushState
   *
   * Example
   *
   *     app.bind('runRoute', function () {
   *       console.log('about to run a route')
   *     })
   *
   * @param {String} event event name
   * @param {Function} fn callback
   * @memberOf event
   */
  this.bind = function (event, fn) {
    (callbacks[event] = callbacks[event] || []).push(fn);
    return this;
  };

  /**
   * Triggers an event with the given arguments.
   *
   * @param {String} event event name
   * @param {Mixed} ...
   * @memberOf event
   */
  this.trigger = function (event) {
    var args = Davis.utils.toArray(arguments, 1),
        handlers = callbacks[event];

    if (!handlers) return this

    for (var i = 0, len = handlers.length; i < len; ++i) {
      handlers[i].apply(this, args)
    }

    return this;
  };
}
