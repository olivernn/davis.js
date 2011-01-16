Davis = function (routes) {
  var app = new Davis.App ();
  routes.call(Davis.Route.drawer);
  return app
};