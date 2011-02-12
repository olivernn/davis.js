/*!
 * Davis - pubsub
 * Copyright (C) 2011 Oliver Nightingale
 * MIT Licensed
 */


/**
 * Provides back button enabled publish subscribe functionality to a Davis.App.
 */
Davis.stateMapper = {

  /**
   * Stores all subscription handlers
   * @private
   */
  _actions: {},

  /** ## app.lookupSubscribers
   * looks up and returns all handlers subscribed to the passed message.
   * @param {Davis.Message} message The message that you want to lookup subscribed handlers for
   * @returns {Array} handlers An array of handlers for the passed message, may be empty.
   */
  lookupStates: function (state) {
    if (!this._actions[state.namespace]) this._actions[state.namespace] = {}
    if (!this._actions[state.namespace][state.name]) this._actions[state.namespace][state.name] = []
    return this._actions[state.namespace][state.name]
  },

  /**
   * ## app.subscribe
   * Subscribe to a message with the passed handler.  More than one handler can subscribe to a particular
   * message.  The handler is called whenever a matching message is published.  The published message is
   * passed as the first param to the handler function.
   *
   * @param {String} messageName The message name to subscribe to.
   * @param {Function} handler The handler to be run whenever the message with messageName is published
   *
   * ### Example
   *
   *     app.state('foo', function (msg) {
   *       // subscribed to the global message 'foo'
   *     })
   *     
   *     app.state('foo.bar', function (msg) {
   *       // subscribe to the foo message in the bar namespace
   *     })
   *     
   */
  state: function (stateName, entryAction) {
    var self = this
    var state = new Davis.State(stateName)

    var actions = this.lookupStates(state)
    actions.push(entryAction)
    this._actions[state.namespace][state.name] = actions

    return this
  },

  /**
   * ## app.unsubscribe
   * Unsubscribe from a particular message.  Can unsubscribe a single message or a whole message namespace.
   * All handlers that are subscribed to the messsage will be unsubscribed and will no longer be called
   * when a message is published.
   *
   * @param {String} eventName The name of the message to unsubscribe from.
   *
   * ### Example
   *
   *     // unsubscribe from the global foo message
   *     app.unsubscribe('foo')
   *     
   *     // unsubsribe from the foo message in the bar namespace
   *     app.unsubscribe('foo.bar')
   *     
   *     // unsubscribe from the whole bar message namespace
   *     app.unsubscribe('.bar')
   */
  clearState: function (stateName) {
    var state = new Davis.State(stateName)
    if (state.name) {
      if (this._actions[state.namespace]) {
        this._actions[state.namespace][state.name] = []
      };
    } else {
      delete this._actions[state.namespace]
    };
  },

  /**
   * ## app.publish
   * Publish a message, optionally with some associated data.  All handlers subscribing to the message
   * will be notified.
   *
   * @param {String} name The name of the message to publish
   * @param {Object} data An optional object of data that will be attatched the the published event
   *
   * ### Example
   *
   *     // publish a global foo message
   *     app.publish('foo')
   *     
   *     // publsh a foo message in the bar namespace
   *     app.publish('foo.bar')
   *     
   *     // publish a message with some associated dataeve
   *     app.publish('foo.bar', {"foo": "bar"})
   */
  trans: function (stateName, data) {
    var state = new Davis.State(stateName, data)
    Davis.history.pushState(state)
    return this
  }

};