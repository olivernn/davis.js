Davis.router = function () {
  var self = this
  var verbs = ['get', 'post', 'put', 'delete'];
  var filters = ['before', 'after'];

  verbs.forEach(function (verb) {
    self[verb] = function (path, handler) {
      self._routeCollection.push(new Davis.Route (verb, path, handler));
    }
  })

  filters.forEach(function (filter) {
    self[filter] = function (handler) {
      self._filterCollection[filter].push(new Davis.Route (filter, /.+/, handler));
    }

    var lookupName = 'lookup' + filter.replace(/^\w/, function ($0) { return $0.toUpperCase()}) + 'Filter';

    self[lookupName] = function (method, path) {
      return self._filterCollection[filter].filter(function (route) {
        return route.match(method, path)
      });
    }
  })

  self._routeCollection = [];
  self._filterCollection = {
    before: [],
    after: []
  };

  self.lookupRoute = function (method, path) {
    return this._routeCollection.filter(function (route) {
      return route.match(method, path)
    })[0];
  };
}