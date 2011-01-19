Davis.Request = function (raw) {
  var self = this;
  this.params = {};
  this.title = raw.title;
  this.queryString = raw.fullPath.split("?")[1];

  if (this.queryString) {
    this.queryString.split("&").forEach(function (keyval) {
      var paramName = keyval.split("=")[0],
          paramValue = keyval.split("=")[1],
          nestedParamRegex = /^(\w+)%5B(\w+)%5D/,
          nested;

      if (nested = nestedParamRegex.exec(paramName)) {
        var paramParent = nested[1];
        var paramName = nested[2];
        var parentParams = self.params[paramParent] || {};
        parentParams[paramName] = paramValue;
        self.params[paramParent] = parentParams;
      } else {
        self.params[paramName] = paramValue;
      };

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

Davis.Request.forPageLoad = function () {
  return new this ({
    method: 'get',
    fullPath: window.location.pathname,
    title: document.title
  });
}