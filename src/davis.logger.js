/*!
 * Davis - logger
 * Copyright (C) 2011 Oliver Nightingale
 * MIT Licensed
 */

/**
 * A module for enhancing the standard logging available through the console object.
 * Used internally in Davis and available for use outside of Davis.
 *
 * Generates log messages of varying severity in the format:
 *
 * `[Sun Jan 23 2011 16:15:21 GMT+0000 (GMT)] <message>`
 */
Davis.logger = (function () {

  /**
   * Generating the timestamp portion of the log message
   * @private
   */
  var timestamp = function (){
    return "[" + Date() + "]";
  }

  /**
   * Pushing the timestamp onto the front of the arguments to log
   * @private
   */
  var prepArgs = function (args) {
    var a = Davis.toArray(args)
    a.unshift(timestamp())
    return a
  }

  /**
   * ## Davis.logger.error
   * Prints an error message to the console if the console is available.
   *
   * @params {String} All arguments are combined and logged to the console.
   */
  var error = function () {
    if (window.console) console.error.apply(console, prepArgs(arguments))
  }

  /**
   * ## Davis.logger.info
   * Prints an info message to the console if the console is available.
   *
   * @params {String} All arguments are combined and logged to the console.
   */
  var info = function () {
    if (window.console) console.info.apply(console, prepArgs(arguments))
  }

  /**
   * ## Davis.logger.warn
   * Prints a warning message to the console if the console is available.
   *
   * @params {String} All arguments are combined and logged to the console.
   */
  var warn = function () {
    if (window.console) console.warn.apply(console, prepArgs(arguments))
  }

  /**
   * Exposes the public methods of the module
   * @private
   */
  return {
    error: error,
    info: info,
    warn: warn
  }
})()