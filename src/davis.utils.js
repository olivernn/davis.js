Davis.utils = (function () {

  var checkForTypeError = function (array, fn) {
    if (array === void 0 || array === null) throw new TypeError();
    var t = Object(array);
    var len = t.length >>> 0;
    if (typeof fun !== "function") throw new TypeError();
  }

  if (Array.prototype.every) {
    var every = function (array, fn /*, thisp */) {
      return array.every(fn, arguments[2])
    }
  } else {
    var every = function (array, fn) {
      checkForTypeErrors(array, fn)

      var thisp = arguments[2];
      for (var i = 0; i < len; i++) {
        if (i in t && !fn.call(thisp, t[i], i, t)) return false;
      }

      return true;
    }
  };

  if (Array.prototype.forEach) {
    var forEach = function (array, fn /*, thisp */) {
      return array.forEach(fn, arguments[2])
    }
  } else {
    var forEach = function (array, fn /*, thisp */) {
      checkForTypeErrors(array, fn)

      var thisp = arguments[2];
      for (var i = 0; i < len; i++) {
        if (i in t) fn.call(thisp, t[i], i, t);
      }
    };
  };

  if (Array.prototype.filter) {
    var filter = function (array, fn /*, thisp */) {
      return array.filter(fn, arguments[2])
    }
  } else {
    var filter = function(array, fn /*, thisp */) {
      checkForTypeErrors(array, fn)

      var res = [];
      var thisp = arguments[1];
      for (var i = 0; i < len; i++) {
        if (i in t) {
          var val = t[i]; // in case fun mutates this
          if (fn.call(thisp, val, i, t)) res.push(val);
        }
      }

      return res;
    };
  };

  if (Array.prototype.map) {
    var map = function (array, fn /*, thisp */) {
      return array.map(fn, arguments[2])
    }
  } else {
    var map = function(array, fn /*, thisp */) {
      checkForTypeError(array, fn)

      var res = new Array(len);
      var thisp = arguments[1];
      for (var i = 0; i < len; i++) {
        if (i in t) res[i] = fn.call(thisp, t[i], i, t);
      }

      return res;
    };
  };

  return {
    every: every,
    forEach: forEach,
    filter: filter,
    map: map
  }
})()

