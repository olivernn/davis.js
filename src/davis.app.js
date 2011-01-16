Davis.App = function () {
  this.foo = "bar"
  this.running = false;
};

Davis.App.prototype = {

  settings: {
    linkSelector: 'a',
    formSelector: 'form'
  },

  start: function () {
    Davis.Interceptor.enable(this.settings);
    Davis.History.onChange(function (request) {
      var route = Davis.Route.lookup(request.method, request.path);
      if (route) route.run(request);
      return false;
    })
    this.running = true;
  }
}