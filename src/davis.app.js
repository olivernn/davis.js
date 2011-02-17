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

    use: function (plugin) {
      plugin.apply(this, Array.prototype.slice.call(arguments, 1))
    },

    helpers: function (helpers) {
      for (property in helpers) {
        if (helpers.hasOwnProperty(property)) Davis.Request.prototype[property] = helpers[property]
      }
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
     * `throwErrors` decides whether or not any errors will be caugth by Davis.  If this is set to true
     * errors will be thrown so that the request will not be handled by JavaScript, the server will have
     * to provide a response.  When set to false errors in a route will be caught and the server will not
     * receive the request.
     *
     * @see #configure
     */
    settings: {
      linkSelector: 'a',
      formSelector: 'form',
      logger: Davis.logger,
      throwErrors: true
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

      var handleRequest = function (request) {
        if (beforeFiltersPass(request)) {
          self.trigger('lookupRoute', request)
          var route = self.lookupRoute(request.method, request.path);
          if (route) {
            self.trigger('runRoute', request, route);

            try {
              route.run(request)
            } catch (error) {
              self.trigger('routeError', request, route, error)
              self.settings.logger.error(error.message, error.stack)
              if (self.settings.throwErrors) throw(error)
            }

            self.lookupAfterFilter(request.method, request.path)
                  .every(runFilterWith(request));
          } else {
            self.trigger('routeNotFound', request);
          }
        } else {
          self.trigger('requestHalted', request)
        }
      }

      Davis.history.onChange(function (req) {
        handleRequest(req)
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

      handleRequest(Davis.Request.forPageLoad())

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
  }, Davis.listener, Davis.event);

  /**
   * decorate the prototype with routing methods
   * @private
   */
  Davis.router.call(App.prototype)

  return App;
})()