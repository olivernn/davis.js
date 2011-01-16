module('Davis.Route');

test("converting a string path into a regex", function () {
  var route = new Davis.Route('get', '/foo');

  ok((route.path instanceof RegExp), "should convert the path into a regular expression if it isn't already one");
  equal("/^/foo$/g", route.path.toString(), "should convert the path into a regular expression")
  equal(0, route.paramNames.length, "should have no param names")
})

test("capturing the param names from a route", function () {
  var route = new Davis.Route('get', '/foo/:foo_id/bar/:bar_id');

  ok(2, route.paramNames.length, "should have an entry for each param name in the path");
  equal('foo_id', route.paramNames[0], "should capture the param names in the order that they appear")
  equal('bar_id', route.paramNames[1], "should capture the param names in the order that they appear")
  equal("/^/foo/([^\/]+)/bar/([^\/]+)$/g", route.path.toString(), "should replace the param names in the path regex");
})

test('inoking a routes callback', function () {
  var routeRan = false;

  var route = new Davis.Route('get', '/foo', function () {
    routeRan = true;
  })

  route.run({
    path: '/foo'
  });

  ok(routeRan, 'should run route callback when calling run');
})

test("looking up a route", function () {
  Davis.Route.clearAll();

  var getRoute = new Davis.Route('get', '/foo');
  var postRoute = new Davis.Route('post', '/foo');

  equal(Davis.Route.lookup('get', '/foo'), getRoute, 'should match routes based on method and path')
  equal(Davis.Route.lookup('post', '/foo'), postRoute, 'should match routes based on method and path')
})

test("duplicate routes", function () {
  Davis.Route.clearAll();

  var firstRoute = new Davis.Route('get', '/dup')
  var secondRoute = new Davis.Route('get', '/dup')

  equal(Davis.Route.lookup('get', '/dup'), firstRoute, 'will only ever find the first matching route')
})