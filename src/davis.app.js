Davis.App = (function () {
  var klass = function () {
    this.foo = "bar"
    this.running = false;
  };

  klass.prototype = $.extend({

    bind: function (eventName, callback) {

    },

    settings: {
      linkSelector: 'a',
      formSelector: 'form'
    },

    start: function () {
      this.listen();
      Davis.history.onChange(function (request) {
        var route = Davis.Route.lookup(request.method, request.path);
        if (route) route.run(request);
        return false;
      })
      this.running = true;
    },

    trigger: function (eventName) {

    }
  }, Davis.Interceptor);

  return klass;
})()