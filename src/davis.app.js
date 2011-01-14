Davis.App = function () {
  this.foo = "bar"
};

Davis.App.prototype = {
  start: function () {
    Davis.Interceptor.enable();
    Davis.History.onChange(function (request) {
      var route = Davis.Route.lookup(request.method, request.path);
      if (route) route.run(request);
      return false;
    })
  }
}