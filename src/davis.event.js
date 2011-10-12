/*!
 * Davis - event
 * Copyright (C) 2011 Oliver Nightingale
 * MIT Licensed
 */

/**
 * Slice reference.
 */

var slice = [].slice;

/**
 * EventEmitter.
 */

Davis.Emitter = function Emitter() {
  this.callbacks = {};
};

/**
 * Listen on the given `event` with `fn`.
 *
 * @param {String} event
 * @param {Function} fn
 */

Davis.Emitter.prototype.on =
Davis.Emitter.prototype.bind = function(event, fn){
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

Davis.Emitter.prototype.emit =
Davis.Emitter.prototype.trigger = function(event){
  var args = slice.call(arguments, 1)
    , callbacks = this.callbacks[event];

  if (callbacks) {
    for (var i = 0, len = callbacks.length; i < len; ++i) {
      callbacks[i].apply(this, args)
    }
  }

  return this;
};


