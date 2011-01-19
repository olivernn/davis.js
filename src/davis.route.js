Davis.Route = (function () {

  var pathNameRegex = /:([\w\d]+)/g;
  var pathNameReplacement = "([^\/]+)";
  var routeCollection = [];
  var verbs = ['get', 'post', 'put', 'delete'];

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
    routeCollection.push(this);
  }

  klass.prototype = {

    match: function (method, path) {
      return (this.method == method) && (this.path.test(path))
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
      this.callback.call(request, request);
    },

    toString: function () {
      return [this.method, this.path].join(' ');
    }
  };

  klass.drawer = {}

  verbs.forEach(function (method) {
    klass.drawer[method] = function (path, handler) {
      new Davis.Route (method, path, handler);
    };
  });

  klass.lookup = function (method, path) {
    return routeCollection.filter(function (route) {
      return route.match(method, path)
    })[0];
  }

  klass.clearAll = function () {
    routeCollection = []
  }

  return klass;
})()