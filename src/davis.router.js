Davis.Router = (function () {

  var router = {};

  var route = function (method, path, handler) {
    new Davis.Route (method, path, handler);
  };

  ['get', 'post', 'put'].forEach(function (method) {
    router[method] = function (path, handler) {
      route(method, path, handler);
    };
  });

  return router;
})();