/*!
 * Davis - logger
 * Copyright (C) 2011 Oliver Nightingale
 * MIT Licensed
 */

/**
 * A plugin for enhancing the standard logging available through the console object.
 * Automatically included in all Davis apps.
 *
 * Generates log messages of varying severity in the format
 *
 * `[Sun Jan 23 2011 16:15:21 GMT+0000 (GMT)] <message>`
 *
 * @module
 */
Davis.logger = function () {

  /*!
   * Generating the timestamp portion of the log message
   * @private
   */
  function timestamp(){
    return "[" + Date() + "]";
  }

  /*!
   * Pushing the timestamp onto the front of the arguments to log
   * @private
   */
  function prepArgs(args) {
    var a = Davis.utils.toArray(args)
    a.unshift(timestamp())
    return a.join(' ');
  }

  var logType = function (logLevel) {
    return function () {
      if (window.console) console[logLevel](prepArgs(arguments));
    }
  }


  /**
   * Prints an error message to the console if the console is available.
   *
   * @params {String} All arguments are combined and logged to the console.
   * @memberOf logger
   */
   var error = logType('error')

  /**
   * Prints an info message to the console if the console is available.
   *
   * @params {String} All arguments are combined and logged to the console.
   * @memberOf logger
   */
   var info = logType('info')

  /**
   * Prints a warning message to the console if the console is available.
   *
   * @params {String} All arguments are combined and logged to the console.
   * @memberOf logger
   */
   var warn = logType('warn')

  /*!
   * Exposes the public methods of the module
   * @private
   */
  this.logger = {
    error: error,
    info: info,
    warn: warn
  }
}