Davis.Route = (function () {

  var pathNameRegex = /:([\w\d]+)/g;
  var pathNameReplacement = "([^\/]+)";

  var klass = function (method, path, callback) {
    var convertPathToRegExp = function () {
      if (!(path instanceof RegExp)) {
        return new RegExp("^" + path.replace(pathNameRegex, pathNameReplacement) + "$", "g");
      } else {
        return path;
      };
    };

    var convertMethodToRegExp = function () {
      if (!(method instanceof RegExp)) {
        return new RegExp("^" + method + "$");
      } else {
        return method
      };
    }

    var capturePathParamNames = function () {
      var names = [], a;
      while ((a = pathNameRegex.exec(path))) names.push(a[1]);
      return names;
    };

    this.paramNames = capturePathParamNames();
    this.path = convertPathToRegExp();
    this.method = convertMethodToRegExp();
    this.callback = callback;
  }

  klass.prototype = {

    match: function (method, path) {
      return (this.method.test(method)) && (this.path.test(path))
    },

    run: function (request) {
      this.path.lastIndex = 0
      var matches = this.path.exec(request.path);
      if (matches) {
        matches.shift();
        for (var i=0; i < matches.length; i++) {
          request.params[this.paramNames[i]] = matches[i];
        };
      };
      this.path.lastIndex = 0
      return this.callback.call(request, request);
    },

    toString: function () {
      return [this.method, this.path].join(' ');
    }
  };

  return klass;
})()