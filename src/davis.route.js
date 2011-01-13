Davis.Route = function (method, path, callback) {

  var convertPathToRegExp = function () {
    if (!(path instanceof RegExp)) {
      return new RegExp("^" + path.replace(/:([\w\d]+)/g, "([^\/]+)") + "$", "g");
    };
  };

  var capturePathParamNames = function () {
    var re = /:([\w\d]+)/g
    var names = [];
    while ((a = re.exec(path))) {
      names.push(a[1]);
    };
    return names;
  };

  this.paramNames = capturePathParamNames();
  this.path = convertPathToRegExp();
  this.method = method;
  this.callback = callback;
  Davis.Route.collection.push(this);
}

Davis.Route.collection = [];

Davis.Route.lookup = function (method, path) {
  return this.collection.filter(function (route) {
    return route.match(method, path)
  })[0]
};

Davis.Route.clearAll = function () {
  this.collection = [];
};

Davis.Route.prototype = {

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