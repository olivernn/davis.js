Davis.Request = function (raw) {
  var self = this;
  this.method = raw.method;
  this.params = {};

  var queryParams = raw.fullPath.split("?")[1];

  if (queryParams) {
    queryParams.split("&").forEach(function (keyval) {
      self.params[keyval.split("=")[0]] = keyval.split("=")[1]
    })
  };

  this.path = raw.fullPath.replace(/\?.+/, "");
}

Davis.Request.prototype = {
  redirect: function (path) {
    var req = new Davis.Request ({
      method: 'get',
      fullPath: path
    });
    Davis.History.replaceState(req, 'redirect', req.path)
  }
}