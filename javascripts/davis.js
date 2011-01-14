Davis = (function () {

  var Listener = function () {
    
  }

  Listener.prototype = {
    
  }

  var Route = function () {
    
  }

  Route.prototype = {
    
  }

  var App = function (routeDefinitions) {
    var routes = [];
    routeDefinitions.call(router)
    this.settings = {};
  }

  App.prototype = {
    start: function () {
      if (this.listener) this.listener.stop();
      this.listener = new Listener (this.settings)
      this.listener.start();
    },

    stop: function () {
      this.listener.stop();
    },

    bind: function () {
      
    },

    configure: function () {
      
    }
  }

  return function (routes) {
    var app = new App (routes)
    return app
  }
})()