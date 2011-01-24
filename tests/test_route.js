module('Davis.Route');

test("converting a string path into a regex", function () {
  var route = new Davis.Route('get', '/foo');

  ok((route.path instanceof RegExp), "should convert the path into a regular expression if it isn't already one");
  ok(route.path.test('/foo'), "path regexp should match the right paths")
  ok(!route.path.test('/bar'), "path regexp should not match the wrong paths")
  ok(route.path.test("/foo"))
  equal(0, route.paramNames.length, "should have no param names")
})

test("capturing the param names from a route", function () {
  var route = new Davis.Route('get', '/foo/:foo_id/bar/:bar_id');

  ok(2, route.paramNames.length, "should have an entry for each param name in the path");
  equal('foo_id', route.paramNames[0], "should capture the param names in the order that they appear")
  equal('bar_id', route.paramNames[1], "should capture the param names in the order that they appear")
  ok(route.path.test('/foo/12/bar/blah'), "should match the right kind of paths");
  ok(!route.path.test('/bar/12/foo/blah'), "should not match the wrong kind of paths");
})

test('inoking a routes callback', function () {
  var routeRan = false;

  var route = new Davis.Route('get', '/foo', function () {
    routeRan = true;
    return "foo"
  })

  var response = route.run({
    path: '/foo'
  });

  ok(routeRan, 'should run route callback when calling run');
  equal(response, "foo", "should return whatever the callback returns")
})