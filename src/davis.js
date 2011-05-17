/*!
 * Davis
 * Copyright (C) 2011 Oliver Nightingale
 * MIT Licensed
 */

/**
 * Convinience method for instantiating a new Davis app and configuring it to use the passed
 * routes and subscriptions.
 *
 * @param {Function} config A function that will be run with a newly created Davis.App as its context,
 * should be used to set up app routes, subscriptions and settings etc.
 */
Davis = function (config) {
  var app = new Davis.App ();
  config.call(app);
  return app
};

/**
 * ## Davis.supported()
 * Checks whether Davis is supported in the current browser
 *
 * @returns {Boolean}
 */
Davis.supported = function () {
  return (typeof window.history.pushState == 'function')
}

/**
 * ## Davis.noop
 * A function that does nothing, used as a default param for any callbacks.
 * 
 * @private
 * @returns {Function}
 */
Davis.noop = function () {}