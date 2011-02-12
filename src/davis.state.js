/*!
 * Davis - Message
 * Copyright (C) 2011 Oliver Nightingale
 * MIT Licensed
 */

/**
 * Davis.Message are used in the pubsub module of Davis.  They encapsulate the name and namespace of the
 * message as well as any extra data that is published with a message.
 *
 * Messages can be namespaced, this is done by separating the name and namespace with a '.', e.g. "foo.bar"
 * has name of 'foo' and namespace of 'bar'.
 *
 * Messages can be optionally created with some arbitrary data that will be associated with the created
 * message.  This data will be available to all handlers that subscribe to the message.
 *
 * @constructor
 * @param {String} name The name of the message, can include namespace e.g. "name.namespace" or be global
 * e.g. "global"
 * @param {Object} data Optional data to be associated with the message and made available to all subscribers
 *
 * ### Example:
 *     // global message with associated data
 *     var message = new Davis.Message('foo', {
 *       "blah": "halb"
 *     })
 *     
 *     // namespaced message with no associated data
 *     var message = new Davis.Message('foo.bar')
 *
 */
Davis.State = function (name, data) {
  this.display = name;
  this.name = name.split('.')[0]
  this.namespace = name.split('.')[1] || 'global'
  this.data = data
  this.type = 'state'
}

/**
 * ## message.toString
 * Converts the message to a string representation of itself.
 *
 * @returns {String} string representation of the request
 */
Davis.State.prototype.toString = function () {
  return ["STATE", this.display].join(' ')
}