Davis.Route = (function () {

  var pathNameRegex = /:([\w\d]+)/g;
  var pathNameReplacement = "([^\/]+)";

  var klass = function (method, path, callback) {
    var convertPathToRegExp = function () {
      if (!(path instanceof RegExp)) {
        return new RegExp("^" + path.replace(pathNameRegex, pathNameReplacement) + "$", "g");
      };
    };

    var capturePathParamNames = function () {
      var names = [], a;
      while ((a = pathNameRegex.exec(path))) names.push(a[1]);
      return names;
    };

    this.paramNames = capturePathParamNames();
    this.path = convertPathToRegExp();
    this.method = method;
    this.callback = callback;
    Davis.Route.collection.push(this);
  }

  klass.prototype = {

    match: function (method, path) {
      return (this.method == method) && (this.path.test(path))
    },

    run: function (context) {
      this.callback.call(context);
    },

    toString: function () {
      return [this.method, this.path].join(' ');
    }
  };

  return klass;
})()

Davis.Route.collection = [];

Davis.Route.lookup = function (method, path) {
  return this.collection.filter(function (route) {
    return route.match(method, path)
  })[0]
};

Davis.Route.clearAll = function () {
  this.collection = [];
};