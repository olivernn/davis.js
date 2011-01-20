Davis.router = function () {
  var self = this
  var verbs = ['get', 'post', 'put', 'delete'];

  verbs.forEach(function (verb) {
    self[verb] = function (path, handler) {
      self._routeCollection.push(new Davis.Route (verb, path, handler));
    }
  })

  self._routeCollection = [];

  self.lookupRoute = function (method, path) {
    return this._routeCollection.filter(function (route) {
      return route.match(method, path)
    })[0];
  };
}