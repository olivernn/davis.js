Davis.App = (function () {
  var klass = function () {
    this.foo = "bar"
    this.running = false;
  };

  klass.prototype = $.extend({
    settings: {
      linkSelector: 'a',
      formSelector: 'form',
      logger: function (message) {
        if (console) {
          console.log(message)
        };
      }
    },

    start: function () {
      var self = this;

      this
        .bind('runRoute', function (request) {
          self.settings.logger("run route: " + request.toString());
        })
        .bind('routeNotFound', function (request) {
          self.settings.logger("route not found: " + request.toString());
        })
        .bind('start', function () {
          self.settings.logger("application started")
        });

      this.listen();
      this.trigger('start')

      Davis.history.onChange(function (request) {
        self.trigger('lookupRoute', request);
        var route = Davis.Route.lookup(request.method, request.path);
        if (route) {
          self.trigger('runRoute', request);
          route.run(request);
        } else {
          self.trigger('routeNotFound', request)
        }
        return false;
      })
      this.running = true;
    },
  }, Davis.listener, Davis.event);

  return klass;
})()