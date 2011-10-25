/*!
 * Davis - event
 * Copyright (C) 2011 Oliver Nightingale
 * MIT Licensed
 */

Davis.event = function () {

  var callbacks = {}

  /**
   * Listen on the given `event` with `fn`.
   *
   * @param {String} event
   * @param {Function} fn
   */

  this.bind = function (event, fn) {
    (callbacks[event] = callbacks[event] || []).push(fn);
    return this;
  };

  /**
   * Emit `event` with the given args.
   *
   * @param {String} event
   * @param {Mixed} ...
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
