/*!
 * Davis - utils
 * Copyright (C) 2011 Oliver Nightingale
 * MIT Licensed
 */

/*!
 * A module that provides wrappers around modern JavaScript so that native implementations are used
 * whereever possible and JavaScript implementations are used in those browsers that do not natively
 * support them.
 */
Davis.utils = (function () {

  /*!
   * A wrapper around native Array.prototype.every.
   *
   * Falls back to a pure JavaScript implementation in browsers that do not support Array.prototype.every.
   * For more details see the full docs on MDC https://developer.mozilla.org/en/JavaScript/Reference/Global_Objects/Array/every
   *
   * @private
   * @param {array} the array to loop through
   * @param {fn} the function to that performs the every check
   * @param {thisp} an optional param that will be set as fn's this value
   * @returns {Array}
   */
  if (Array.prototype.every) {
    var every = function (array, fn) {
      return array.every(fn, arguments[2])
    }
  } else {
    var every = function (array, fn) {
      if (array === void 0 || array === null) throw new TypeError();
      var t = Object(array);
      var len = t.length >>> 0;
      if (typeof fn !== "function") throw new TypeError();

      var thisp = arguments[2];
      for (var i = 0; i < len; i++) {
        if (i in t && !fn.call(thisp, t[i], i, t)) return false;
      }

      return true;
    }
  };

  /*!
   * A wrapper around native Array.prototype.forEach.
   *
   * Falls back to a pure JavaScript implementation in browsers that do not support Array.prototype.forEach.
   * For more details see the full docs on MDC https://developer.mozilla.org/en/JavaScript/Reference/Global_Objects/Array/forEach
   *
   * @private
   * @param {array} the array to loop through
   * @param {fn} the function to apply to every element of the array
   * @param {thisp} an optional param that will be set as fn's this value
   * @returns {Array}
   */
  if (Array.prototype.forEach) {
    var forEach = function (array, fn) {
      return array.forEach(fn, arguments[2])
    }
  } else {
    var forEach = function (array, fn) {
      if (array === void 0 || array === null) throw new TypeError();
      var t = Object(array);
      var len = t.length >>> 0;
      if (typeof fn !== "function") throw new TypeError();
      

      var thisp = arguments[2];
      for (var i = 0; i < len; i++) {
        if (i in t) fn.call(thisp, t[i], i, t);
      }
    };
  };

  /*!
   * A wrapper around native Array.prototype.filter.
   * Falls back to a pure JavaScript implementation in browsers that do not support Array.prototype.filter.
   * For more details see the full docs on MDC https://developer.mozilla.org/en/JavaScript/Reference/Global_Objects/Array/filter
   *
   * @private
   * @param {array} the array to filter
   * @param {fn} the function to do the filtering
   * @param {thisp} an optional param that will be set as fn's this value
   * @returns {Array}
   */
  if (Array.prototype.filter) {
    var filter = function (array, fn) {
      return array.filter(fn, arguments[2])
    }
  } else {
    var filter = function(array, fn) {
      if (array === void 0 || array === null) throw new TypeError();
      var t = Object(array);
      var len = t.length >>> 0;
      if (typeof fn !== "function") throw new TypeError();
      

      var res = [];
      var thisp = arguments[2];
      for (var i = 0; i < len; i++) {
        if (i in t) {
          var val = t[i]; // in case fn mutates this
          if (fn.call(thisp, val, i, t)) res.push(val);
        }
      }

      return res;
    };
  };

  /*!
   * A wrapper around native Array.prototype.map.
   * Falls back to a pure JavaScript implementation in browsers that do not support Array.prototype.map.
   * For more details see the full docs on MDC https://developer.mozilla.org/en/JavaScript/Reference/Global_Objects/Array/map
   *
   * @private
   * @param {array} the array to map
   * @param {fn} the function to do the mapping
   * @param {thisp} an optional param that will be set as fn's this value
   * @returns {Array}
   */

  if (Array.prototype.map) {
    var map = function (array, fn) {
      return array.map(fn, arguments[2])
    }
  } else {
    var map = function(array, fn) {
      if (array === void 0 || array === null)
        throw new TypeError();

      var t = Object(array);
      var len = t.length >>> 0;
      if (typeof fn !== "function")
        throw new TypeError();

      var res = new Array(len);
      var thisp = arguments[2];
      for (var i = 0; i < len; i++) {
        if (i in t)
          res[i] = fn.call(thisp, t[i], i, t);
      }

      return res;
    };
  };

  /*!
   * A convinience function for converting arguments to a proper array
   *
   * @private
   * @param {args} a functions arguments
   * @param {start} an integer at which to start converting the arguments to an array
   * @returns {Array}
   */
  var toArray = function (args, start) {
    return Array.prototype.slice.call(args, start || 0)
  }

  /*!
   * Exposing the public interface to the Utils module
   * @private
   */
  return {
    every: every,
    forEach: forEach,
    filter: filter,
    toArray: toArray,
    map: map
  }
})()

