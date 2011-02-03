/*!
 * Davis - pubsub
 * Copyright (C) 2011 Oliver Nightingale
 * MIT Licensed
 */

Davis.pubsub = {

  _subscriptions: {},

  lookupSubscriptions: function (name) {
    return this._subscriptions[name]
  },

  subscribe: function (eventName, handler) {
    var handlers = this._subscriptions[eventName] || []
    handlers.push(handler)
    this._subscriptions[eventName] = handlers;
  },

  publish: function (name, data) {
    var event = {
      type: 'ev'
      name: name,
      data: data,
      title: name,
      path: ''
    }

    Davis.history.pushState(event)
  }

};

