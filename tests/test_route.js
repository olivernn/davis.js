module('Davis.Route');

test("converting a string path into a regex", function () {
  var route = factory('route')

  ok((route.path instanceof RegExp), "should convert the path into a regular expression if it isn't already one");
  ok(route.path.test('/foo'), "path regexp should match the right paths")
  ok(!route.path.test('/bar'), "path regexp should not match the wrong paths")
  ok(route.path.test("/foo"))
  empty(route.paramNames, "should have no param names")
})

test("capturing the param names from a route", function () {
  var route = factory('route', {
    path: '/foo/:foo_id/bar/:bar_id'
  })

  ok(2, route.paramNames.length, "should have an entry for each param name in the path");
  equal('foo_id', route.paramNames[0], "should capture the param names in the order that they appear")
  equal('bar_id', route.paramNames[1], "should capture the param names in the order that they appear")
  ok(route.path.test('/foo/12/bar/blah'), "should match the right kind of paths");
  ok(!route.path.test('/bar/12/foo/blah'), "should not match the wrong kind of paths");
})

test('inoking a routes callback', function () {
  var routeRan = false;

  var route = factory('route', {
    callback: function () {
      routeRan = true
      return "foo"
    }
  })

  var response = route.run({
    path: '/foo'
  });

  ok(routeRan, 'should run route callback when calling run');
  equal(response, "foo", "should return whatever the callback returns")
})

test("handling route middleware", function () {
  var handler = function () {},
      middleware = function () {}
      route = new Davis.Route('get', '/foo', [middleware, handler])

  ok(route.handlers instanceof Array)
  equal(2, route.handlers.length)
})

test("calling all handlers for a route", function () {
  var handlerCalled = false,
      middlewareCalled1 = false,
      middlewareCalled2 = false,
      handler = function (req) { handlerCalled = true },
      middleware1 = function (req, next) { middlewareCalled1 = true ; next(req) },
      middleware2 = function (req, next) { middlewareCalled2 = true ; next(req) },
      route = new Davis.Route('get', '/foo', [middleware1, middleware2, handler])

  route.run({path: '/foo'})
  ok(handlerCalled)
  ok(middlewareCalled1)
  ok(middlewareCalled2)
})

test("middleware can modify the request for a route", function () {
  var middleware = function (req, next) { req.foo = 'bar' ; next(req) }
      route = new Davis.Route('get', '/foo', [middleware, function (req) {
        equal(req.foo, 'bar')
      }])

  route.run({path: '/foo'})
})

test("middleware can halt execution by not calling next", function () {
  var routeComplete = false,
      middleware = function () {},
      route = new Davis.Route('get', '/foo', middleware, function (req) {
        routeComplete = true
      })

  route.run({path: '/foo'})
  ok(!routeComplete)
})

test("wildcard matches", function () {
  var route = new Davis.Route('get', '/foo/*splat', $.noop)
  ok(route.path.test('/foo/bar/baz'))
  ok(!route.path.test('/foo'))
  ok(route.path.test('/foo/bar'))
})

test("wildcard param names", function () {
  var params = null,
      request = new Davis.Request ('/foo/bar/baz')

  var route = new Davis.Route ('get', '/foo/*splat', function (req) {
    params = req.params
  })

  route.run(request)
  equal(params.splat, 'bar/baz')
})

test("wildcard and normal param names", function () {
  var params = null,
      request = new Davis.Request ('/foo/bar/baz/qwerty_123')

  var route = new Davis.Route ('get', '/foo/:bar/*splat', function (req) {
    params = req.params
  })

  route.run(request)
  equal(params.bar, 'bar')
  equal(params.splat, 'baz/qwerty_123')
})
