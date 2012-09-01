/*!
 * Davis - no_iOS
 * Copyright (C) 2011 Oliver Nightingale
 * MIT Licensed
 */

/**
 * Davis.noIOS is a plugin that will mark iOS devices of version less than 4 as unsupported.
 * iOS devices have several bugs in their implementation of pushState, if these bugs are causing
 * issues for your application you can use this extension to disable support for iOS devices.
 *
 *    this.extend(Davis.noIOS)
 *
 * @plugin
 */
Davis.noIOS = function () {

  Davis.supported = (function (uber) {
    var iosRegex = /\([iPhone;]?[iPad;]?[iPod;]?.+OS (\d)_(\d)/,
        match = iosRegex.exec(window.navigator.userAgent),
        majorVersionNumber = match && match[1] || Infinity;

    return function () {
      return uber() && (!match || majorVersionNumber > 4)
    }
  })(Davis.supported)
}
