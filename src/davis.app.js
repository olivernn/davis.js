/*!
 * Davis - App
 * Copyright (C) 2011 Oliver Nightingale
 * MIT Licensed
 */

/**
 * A private scope for the Davis.App constructor
 * @private
 */
Davis.App = (function () {

  /**
   * counter for the apps created used in creating a uniqueish id for this app
   * @private
   */
  var appCounter = 0;

  /**
   * Constructor for Davis.App
   * @constructor
   * @returns {Davis.App}
   */
  var App = function () {
    this.id = [new Date().valueOf(), appCounter++].join("-");
    this.running = false;
  };

  /**
   * creating the prototype for the app from modules listener and event
   * @private
   */
  App.prototype = $.extend({

    /**
     * ## app.configure
     * A convinience function for changing the apps default settings.
     * Should be used before starting the app to ensure any new settings
     * are picked up and used.
     *
     * @param {Function} config - This function will be executed with the context bound to the apps setting object
     *
     * ### Example:
     *     app.configure(function () {
     *       this.linkSelector: 'a.davis'
     *       this.formSelector: 'form.davis'
     *     })
     */
    configure: function (config) {
      config.call(this.settings);
    },

    /**
     * ## app.settings
     * Settings for the app.  These may be overriden directly or by using the configure
     * convinience method.
     *
     * `linkSelector` is the jquery selector for all the links on the page that you want
     * Davis to respond to.  These links will not trigger a normal http request.
     *
     * `formSelector` is similar to link selector but for all the forms that davis will bind to
     *
     * `logger` is the object that the app will use to log through.
     *
     * @see #configure
     */
    settings: {
      linkSelector: 'a',
      formSelector: 'form',
      logger: Davis.logger
    },

    /**
     * ## app.start
     * Once the app's routes have been defined and any additional configuration has happened the 
     * start method should be called.
     *
     * Starting the app binds all links and forms, so clicks and submits
     * create Davis requests that will be pushed onto the browsers history stack.  Browser history change
     * events will be picked up and the request that caused the change will be matched against the apps
     * routes and filters.
     */
    start: function () {
      var self = this;

      if (!Davis.supported()) {
        this.trigger('unsupported')
        return
      };

      var runFilterWith = function (request) {
        return function (filter) {
          var result = filter.run(request, request);
          return (typeof result === "undefined" || result);
        }
      }

      var beforeFiltersPass = function (request) {
        return self.lookupBeforeFilter(request.method, request.path)
                      .every(runFilterWith(request))
      }

      var handle = {
        request: function (request) {
          if (beforeFiltersPass(request)) {
            self.trigger('lookupRoute', request)
            var route = self.lookupRoute(request.method, request.path);
            if (route) {
              self.trigger('runRoute', request, route);
              route.run(request);
              self.lookupAfterFilter(request.method, request.path)
                    .every(runFilterWith(request));
            } else {
              self.trigger('routeNotFound', request);
            }
          } else {
            self.trigger('requestHalted', request)
          }
        },

        state: function (state) {
          self.trigger('lookupState', state)
          self.lookupStates(state).forEach(function (action) {
            action.call(state, state)
          })
        }
      }

      Davis.history.onChange(function (obj) {
        handle[obj.type](obj)
      });

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
      this.running = true;

      handle.request(Davis.Request.forPageLoad())

    },

    /**
     * ## app.stop
     * Stops the app listening to clicks and submits on all forms and links found using the current
     * apps settings.
     */
    stop: function () {
      this.unlisten();
      this.trigger('stop')
    }

  /**
   * including listener and event modules
   * @private
   */
  }, Davis.listener, Davis.event, Davis.stateMapper);

  /**
   * decorate the prototype with routing methods
   * @private
   */
  Davis.router.call(App.prototype)

  return App;
})()