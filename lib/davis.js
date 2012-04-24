/*!
 * Davis - http://davisjs.com - JavaScript Routing - @VERSION
 * Copyright (C) 2011 Oliver Nightingale
 * MIT Licensed
 */
;
/**
 * Convinience method for instantiating a new Davis app and configuring it to use the passed
 * routes and subscriptions.
 *
 * @param {Function} config A function that will be run with a newly created Davis.App as its context,
 * should be used to set up app routes, subscriptions and settings etc.
 * @namespace
 * @returns {Davis.App}
 */
Davis = function (config) {
  var app = new Davis.App
  config && config.call(app)
  Davis.$(function () { app.start() })
  return app
};

/**
 * Stores the DOM library that Davis will use.  Can be overriden to use libraries other than jQuery.
 */
if (window.jQuery) {
  Davis.$ = jQuery
} else {
  Davis.$ = null
};

/**
 * Checks whether Davis is supported in the current browser
 *
 * @returns {Boolean}
 */
Davis.supported = function () {
  return (typeof window.history.pushState == 'function')
}

/*!
 * A function that does nothing, used as a default param for any callbacks.
 * 
 * @private
 * @returns {Function}
 */
Davis.noop = function () {}

/**
 * Method to extend the Davis library with an extension.
 *
 * An extension is just a function that will modify the Davis framework in some way,
 * for example changing how the routing works or adjusting where Davis thinks it is supported.
 *
 * Example:
 *     Davis.extend(Davis.hashBasedRouting)
 *
 * @param {Function} extension the function that will extend Davis
 *
 */
Davis.extend = function (extension) {
  extension(Davis)
}

/*!
 * the version
 */
Davis.version = "@VERSION";