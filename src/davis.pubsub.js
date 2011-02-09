/*!
 * Davis - pubsub
 * Copyright (C) 2011 Oliver Nightingale
 * MIT Licensed
 */

Davis.pubsub = {

  _subs: {},

  lookupSubscribers: function (message) {
    if (!this._subs[message.namespace]) this._subs[message.namespace] = {}
    if (!this._subs[message.namespace][message.name]) this._subs[message.namespace][message.name] = []
    return this._subs[message.namespace][message.name]
  },

  subscribe: function (eventName, handler) {
    var self = this
    var message = new Davis.Message(eventName)

    var handlers = this.lookupSubscribers(message)
    handlers.push(handler)
    this._subs[message.namespace][message.name] = handlers

    return this
  },

  unsubscribe: function (eventName, handler) {
    var message = new Davis.Message(eventName)
    if (message.name) {
      if (this._subs[message.namespace]) {
        this._subs[message.namespace][message.name] = []
      };
    } else {
      delete this._subs[message.namespace]
    };
  },

  publish: function (name, data) {
    var message = new Davis.Message(name, data)
    Davis.history.pushState(message)
    return this
  }

};