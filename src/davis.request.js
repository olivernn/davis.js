Davis.Request = function (event) {
  var self = this;
  var target = $(event.target);
  var fullPath = target.attr('href');

  this.params = {};

  var parseParams = function (params) {
    params.split("&").forEach(function (keyval) {
      self.params[keyval.split("=")[0]] = keyval.split("=")[1]
    })
  }

  var clickRequest = function () {
    var queryParams = fullPath.split("?")[1];

    if (queryParams) {
      parseParams(queryParams)
    };

    self.path = fullPath.replace(/\?.+/, "");
    self.method = 'get'
  }

  var submitRequest = function () {
    self.path = target.attr('action');
    parseParams(target.serialize());
    self.method = target.attr('method') || 'get';
  }

  if (event.type == "click") {
    clickRequest();
  } else if (event.type == "submit") {
    submitRequest();
  };


  // var clickRequest = function () {
  //   self.path = target.href.split(/\?/)[0];
  //   self.method = 'get';
  // };
  // 
  // var submitRequest = function () {
  //   self.path = target.attr('action');
  //   self.method = target.attr('method') || 'post';
  //   target.serialize().split(/&/).forEach(function (keyval) {
  //     self.params[keyval.split("=")[0]] = keyval.split("=")[1]
  //   });
  // };

  // if (target.is('a')) {
    // clickRequest()
  // } else if (target.is('form')) {
  //   submitRequest()
  // };

  // this.event = event;
}

Davis.Request.prototype = {

}