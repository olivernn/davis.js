Davis.Request = function (raw) {
  var self = this;
  this.method = raw.method;
  this.params = {};
  this.title = raw.title;
  this.queryString = raw.fullPath.split("?")[1];

  if (this.queryString) {
    this.queryString.split("&").forEach(function (keyval) {
      self.params[keyval.split("=")[0]] = keyval.split("=")[1]
    });
  };

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