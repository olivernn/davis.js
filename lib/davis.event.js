/*!
 * Davis - event
 * Copyright (C) 2011 Oliver Nightingale
 * MIT Licensed
 */

Davis.event = (function(){

  /**
   * Slice reference.
   */

  var slice = [].slice;

  /**
   * Listen on the given `event` with `fn`.
   *
   * @param {String} event
   * @param {Function} fn
   */

  function bind(event, fn){
    (this.callbacks[event] = this.callbacks[event] || [])
      .push(fn);
    return this;
  };

  /**
   * Emit `event` with the given args.
   *
   * @param {String} event
   * @param {Mixed} ...
   */

  function trigger(event){
    var args = slice.call(arguments, 1)
      , callbacks = this.callbacks[event];

    if (callbacks) {
      for (var i = 0, len = callbacks.length; i < len; ++i) {
        callbacks[i].apply(this, args)
      }
    }

    return this;
  };

  return {
      on: bind
    , bind: bind
    , trigger: trigger
    , emit: trigger
    , callbacks: {}
  };

})();

