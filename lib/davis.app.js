/*!
 * Davis - App
 * Copyright (C) 2011 Oliver Nightingale
 * MIT Licensed
 */

Davis.App = (function () {

  /**
   * Constructor for Davis.App
   *
   * @constructor
   * @returns {Davis.App}
   */
  function App() {
    this.running = false;
    this.boundToInternalEvents = false;

    this.use(Davis.listener)
    this.use(Davis.event)
    this.use(Davis.router)
    this.use(Davis.logger)
  };

  /**
   * A convinience function for changing the apps default settings.
   *
   * Should be used before starting the app to ensure any new settings
   * are picked up and used.
   *
   * Example:
   *
   *     app.configure(function (config) {
   *       config.linkSelector = 'a.davis'
   *       config.formSelector = 'form.davis'
   *     })
   *
   * @param {Function} config This function will be executed with the context bound to the apps setting object, this will also be passed as the first argument to the function.
   */
  App.prototype.configure = function(config) {
    config.call(this.settings, this.settings);
  };

  /**
   * Method to include a plugin in this app.
   *
   * A plugin is just a function that will be evaluated in the context of the app.
   *
   * Example:
   *     app.use(Davis.title)
   *
   * @param {Function} plugin The plugin to use
   *
   */
  App.prototype.use = function(plugin) {
    plugin.apply(this, Davis.utils.toArray(arguments, 1))
  };

  /**
   * Method to add helper properties to all requests in the application.
   *
   * Helpers will be added to the Davis.Request.prototype.  Care should be taken not to override any existing Davis.Request
   * methods.
   *
   * @param {Object} helpers An object containing helpers to mixin to the request
   */
  App.prototype.helpers = function(helpers) {
    for (property in helpers) {
      if (helpers.hasOwnProperty(property)) Davis.Request.prototype[property] = helpers[property]
    }
  };

  /**
   * Settings for the app.  These may be overriden directly or by using the configure
   * convinience method.
   *
   * `linkSelector` is the jquery selector for all the links on the page that you want
   * Davis to respond to.  These links will not trigger a normal http request.
   *
   * `formSelector` is similar to link selector but for all the forms that davis will bind to
   *
   * `throwErrors` decides whether or not any errors will be caugth by Davis.  If this is set to true
   * errors will be thrown so that the request will not be handled by JavaScript, the server will have
   * to provide a response.  When set to false errors in a route will be caught and the server will not
   * receive the request.
   *
   * `handleRouteNotFound` determines whether or not Davis should handle requests when there is no matching
   * route.  If set to false Davis will allow the request to be passed to your server to handle if no matching
   * route can be found.
   *
   * `generateRequestOnPageLoad` determines whether a request should be generated for the initial page load.
   * by default this is set to false. A Davis.Request will not be generated with the path of the current
   * page.  Setting this to true will cause a request to be passed to your app for the inital page load.
   *
   * @see #configure
   */

  App.prototype.settings = {
    linkSelector: 'a',
    formSelector: 'form',
    throwErrors: true,
    handleRouteNotFound: false,
    generateRequestOnPageLoad: false
  };

  /**
   * Starts the app's routing.
   *
   * Apps created using the convinience Davis() function are automatically started.
   *
   * Starting the app binds all links and forms, so clicks and submits
   * create Davis requests that will be pushed onto the browsers history stack.  Browser history change
   * events will be picked up and the request that caused the change will be matched against the apps
   * routes and filters.
   */
   App.prototype.start = function(){
    var self = this;

    if (this.running) return

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
      return Davis.utils.every(
        self.lookupBeforeFilter(request.method, request.path),
        runFilterWith(request)
      )
    }

    var handleRequest = function (request) {
      if (beforeFiltersPass(request)) {
        self.trigger('lookupRoute', request)
        var route = self.lookupRoute(request.method, request.path);
        if (route) {
          self.trigger('runRoute', request, route);

          try {
            route.run(request)
            self.trigger('routeComplete', request, route)
          } catch (error) {
            self.trigger('routeError', request, route, error)
          }

          Davis.utils.every(
            self.lookupAfterFilter(request.method, request.path),
            runFilterWith(request)
          );

        } else {
          self.trigger('routeNotFound', request);
        }
      } else {
        self.trigger('requestHalted', request)
      }
    }

    var bindToInternalEvents = function () {
      self
        .bind('runRoute', function (request) {
          self.logger.info("runRoute: " + request.toString());
        })
        .bind('routeNotFound', function (request) {
          if (!self.settings.handleRouteNotFound && !request.isForPageLoad) {
            self.stop()
            request.delegateToServer()
          };
          self.logger.warn("routeNotFound: " + request.toString());
        })
        .bind('start', function () {
          self.logger.info("application started")
        })
        .bind('stop', function () {
          self.logger.info("application stopped")
        })
        .bind('routeError', function (request, route, error) {
          if (self.settings.throwErrors) throw(error)
          self.logger.error(error.message, error.stack)
        });

      Davis.location.onChange(function (req) {
        handleRequest(req)
      });

      self.boundToInternalEvents = true
    }

    if (!this.boundToInternalEvents) bindToInternalEvents()

    this.listen();
    this.trigger('start')
    this.running = true;

    if (this.settings.generateRequestOnPageLoad) handleRequest(Davis.Request.forPageLoad())

  };

  /**
   * Stops the app's routing.
   *
   * Stops the app listening to clicks and submits on all forms and links found using the current
   * apps settings.
   */
  App.prototype.stop = function() {
    this.unlisten();
    this.trigger('stop')
    this.running = false
  };

  return App;
})()