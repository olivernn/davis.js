Davis = function (routes) {
  var app = new Davis.App ();
  routes.call(app);
  return app
};