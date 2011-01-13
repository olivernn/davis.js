Davies = function (routes) {

  var app = {
    start: function () {
      Davies.Interceptor.start();
    }
  }

  window.onpopstate = function (event) {
    // Davies.Route.lookup(event)
    console.log(event)
  }

  var router = {
    get: function (path, callback) {
      new Davies.Route('get', path, callback);
    }
  }

  routes.call(router);

  return app;
}

Davies.Interceptor = (function () {

  var registerStateChange = function (method, url) {
    console.log(history.pushState)
    history.pushState({
      method: method,
      url: url
    }, 'test', url)
  };

  var interceptLinks = function () {
    $('body').delegate('a', 'click', function () {
      registerStateChange('get', $(this).attr('href'));
      return false;
    });
  };

  var start = function () {
    interceptLinks();
  }

  return {
    start: start
  }
})()

Davies.Route = function (method, path, callback) {
  this.method = method;
  this.path = path;
  this.callback = callback;
  Davies.Route.collection.push(this);
}

Davies.Route.collection = [];

Davies.Route.lookup = function (method, path) {
  this.collection.filter(function (route) {
    return route.match(method, path)
  })[0]
};

Davies.Route.prototype = {

  match: function (method, path) {
    return (this.method == method) && (this.path == path)
  },

  run: function (context) {
    this.callback.call(context);
  }
};