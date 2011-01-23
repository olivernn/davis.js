Davis.App = (function () {

  var appCounter = 0;

  var klass = function () {
    this.id = [new Date().valueOf(), appCounter++].join("-");
    this.running = false;
  };

  klass.prototype = $.extend({

    configure: function (config) {
      config.call(this.settings);
    },

    settings: {
      linkSelector: 'a',
      formSelector: 'form',
      logger: Davis.logger
    },

    start: function () {
      var self = this;

      this
        .bind('runRoute', function (request) {
          self.settings.logger.info("runRoute: " + request.toString());
        })
        .bind('routeNotFound', function (request) {
          self.settings.logger.warn("routeNotFound: " + request.toString());
        })
        .bind('start', function () {
          self.settings.logger.info("application started")
        });

      this.listen();
      this.trigger('start')

      var runFilterWith = function (request) {
        return function (filter) {
          var result = filter.run(request, request);
          return (typeof result === "undefined" || result);
        }
      }

      var beforeFiltersPass = function (request) {
        return self.lookupBeforeFilter(request.method, request.path).every(runFilterWith(request))
      }

      Davis.history.onChange(function (request) {
        if (beforeFiltersPass(request)) {
          var route = self.lookupRoute(request.method, request.path);
          if (route) {
            self.trigger('runRoute', request);
            route.run(request);
            self.lookupAfterFilter(request.method, request.path).every(runFilterWith(request));
          } else {
            self.trigger('routeNotFound', request);
          }
        } else {
          self.trigger('requestHalted', request)
        }
      });

      this.running = true;
    },

    stop: function () {
      this.unlisten();
      this.bind('stop')
    }
  }, Davis.listener, Davis.event);

  Davis.router.call(klass.prototype)

  return klass;
})()