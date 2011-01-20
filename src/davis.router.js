Davis.router = {

  _routeCollection: [],

  lookupRoute: function (method, path) {
    return this._routeCollection.filter(function (route) {
      return route.match(method, path)
    })[0];
  },

  get: function (path, handler) {
    this._routeCollection.push(new Davis.Route ('get', path, handler));
  },

  post: function (path, handler) {
    this._routeCollection.push(new Davis.Route ('post', path, handler));
  },

  put: function (path, handler) {
    this._routeCollection.push(new Davis.Route ('put', path, handler));
  },

  del: function (path, handler) {
    this._routeCollection.push(new Davis.Route ('delete', path, handler));
  }
}