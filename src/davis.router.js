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
    self[filter] = function () {
      var method = /.+/;

      if (arguments.length == 1) {
        var path = /.+/;
        var handler = arguments[0];
      } else if (arguments.length == 2) {
        var path = arguments[0];
        var handler = arguments[1];
      };

      self._filterCollection[filter].push(new Davis.Route (method, path, handler));
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