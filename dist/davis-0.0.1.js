// davis.js JavaScript Routing, version: 0.0.1
// (c) 2011 Oliver Nightingale
//
//  Released under MIT license.
//
Davis = function (routes) {
  var app = new Davis.App ();
  routes.call(Davis.Route.drawer);
  return app
};
Davis.listener = (function () {

  var handler = function (targetExtractor) {
    return function (event) {
      var request = new Davis.Request (targetExtractor.call($(event.target)));
      Davis.history.pushState(request);
      return false;
    };
  };

  var clickHandler = handler(function () {
    return {
      method: 'get',
      fullPath: this.attr('href'),
      title: this.attr('title')
    };
  });

  var submitHandler = handler(function () {
    return {
      method: this.attr('method'),
      fullPath: [this.attr('action'), "?", this.serialize()].join(""),
      title: this.attr('title')
    };
  });

  var listen = function () {
    $(document).delegate(this.settings.formSelector, 'submit', submitHandler)
    $(document).delegate(this.settings.linkSelector, 'click', clickHandler)
  }

  var unlisten = function () {
    $(document).undelegate(this.settings.linkSelector, 'click', clickHandler)
    $(document).undelegate(this.settings.formSelector, 'submit', submitHandler)
  }

  return {
    listen: listen,
    unlisten: unlisten
  }
})()
Davis.event = (function () {

  var callbacks = {}

  var bind = function (eventName, callback) {
    if (!callbacks[eventName]) callbacks[eventName] = [];
    callbacks[eventName].push(callback);
    return this;
  }

  var trigger = function (eventName, data) {
    var self = this;
    if (!callbacks[eventName]) callbacks[eventName] = [];
    callbacks[eventName].forEach(function (callback) {
      callback.call(self, data);
    }) 
    return this;
  }

  return {
    bind: bind,
    trigger: trigger
  }
})()
Davis.logger = (function () {

  var timestamp = function (){
    return "[" + Date() + "]";
  }

  var prepArgs = function (args) {
    var a = Array.prototype.slice.call(args)
    a.unshift(timestamp())
    return a
  }

  var error = function () {
    if (window.console) console.error.apply(console, prepArgs(arguments))
  }

  var info = function () {
    if (window.console) console.info.apply(console, prepArgs(arguments))
  }

  var warn = function () {
    if (window.console) console.warn.apply(console, prepArgs(arguments))
  }

  return {
    error: error,
    info: info,
    warn: warn
  }
})()
Davis.Route = (function () {

  var pathNameRegex = /:([\w\d]+)/g;
  var pathNameReplacement = "([^\/]+)";
  var routeCollection = [];
  var verbs = ['get', 'post', 'put', 'delete'];

  var klass = function (method, path, callback) {
    var convertPathToRegExp = function () {
      if (!(path instanceof RegExp)) {
        return new RegExp("^" + path.replace(pathNameRegex, pathNameReplacement) + "$", "g");
      };
    };

    var capturePathParamNames = function () {
      var names = [], a;
      while ((a = pathNameRegex.exec(path))) names.push(a[1]);
      return names;
    };

    this.paramNames = capturePathParamNames();
    this.path = convertPathToRegExp();
    this.method = method;
    this.callback = callback;
    routeCollection.push(this);
  }

  klass.prototype = {

    match: function (method, path) {
      return (this.method == method) && (this.path.test(path))
    },

    run: function (request) {
      this.path.lastIndex = 0
      var matches = this.path.exec(request.path);
      if (matches) {
        matches.shift();
        for (var i=0; i < matches.length; i++) {
          request.params[this.paramNames[i]] = matches[i];
        };
      };
      this.path.lastIndex = 0
      this.callback.call(request);
    },

    toString: function () {
      return [this.method, this.path].join(' ');
    }
  };

  klass.drawer = {}

  verbs.forEach(function (method) {
    klass.drawer[method] = function (path, handler) {
      new Davis.Route (method, path, handler);
    };
  });

  klass.lookup = function (method, path) {
    return routeCollection.filter(function (route) {
      return route.match(method, path)
    })[0];
  }

  klass.clearAll = function () {
    routeCollection = []
  }

  return klass;
})()
Davis.history = (function () {

  var pushStateHandlers = [];

  var onPushState = function (handler) {
    pushStateHandlers.push(handler);
  };

  var onPopState = function (handler) {
    window.addEventListener('popstate', handler);
  };
  
  var wrapped = function (handler) {
    return function (event) {
      if (event.state) {
        handler(event.state)
      } else {
        handler(new Davis.Request({
          method: 'get',
          fullPath: '/',
          title: 'root'
        }))
      };
    }
  }

  var onChange = function (handler) {
    onPushState(handler);
    onPopState(wrapped(handler));
  };

  var pushState = function (request) {
    history.pushState(request, request.title, request.path);
    pushStateHandlers.forEach(function (handler) {
      handler(request);
    });
  };

  var replaceState = function (request) {
    history.replaceState(request, request.title, request.path);
    pushStateHandlers.forEach(function (handler) {
      handler(request);
    });
  };

  return {
    replaceState: replaceState,
    pushState: pushState,
    onChange: onChange
  }
})()
Davis.Request = function (raw) {
  var self = this;
  this.params = {};
  this.title = raw.title;
  this.queryString = raw.fullPath.split("?")[1];

  if (this.queryString) {
    this.queryString.split("&").forEach(function (keyval) {
      self.params[keyval.split("=")[0]] = keyval.split("=")[1]
    });
  };

  this.method = this.params._method || raw.method;
  this.path = raw.fullPath.replace(/\?.+$/, "");
};

Davis.Request.prototype = {
  redirect: function (path) {
    Davis.history.replaceState(new Davis.Request ({
      method: 'get',
      fullPath: path,
      title: this.title
    }));
  },

  toString: function () {
    return [this.method.toUpperCase(), this.path].join(" ")
  }
};
Davis.App = (function () {
  var klass = function () {
    this.foo = "bar"
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

      Davis.history.onChange(function (request) {
        self.trigger('lookupRoute', request);
        var route = Davis.Route.lookup(request.method, request.path);
        if (route) {
          self.trigger('runRoute', request);
          route.run(request);
        } else {
          self.trigger('routeNotFound', request);
        }
      })
      this.running = true;
    },

    stop: function () {
      this.unlisten();
      this.bind('stop')
    }
  }, Davis.listener, Davis.event);

  return klass;
})()