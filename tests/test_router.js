module("Davis.router")

test("looking up a route", function () {
  var router = factory('router')
  router._routeCollection = [];

  router.get('/foo')
  router.post('/foo')

  var getRoute = router._routeCollection[0]
  var postRoute = router._routeCollection[1]

  equal(router.lookupRoute('get', '/foo'), getRoute, 'should match routes based on method and path')
  equal(router.lookupRoute('post', '/foo'), postRoute, 'should match routes based on method and path')
})

test("shortcuts for verbs", function () {
  var router = factory('router')

  router._routeCollection.length = 0;
  router.get('/foo', $.noop);
  router.post('/foo', $.noop);
  router.put('/foo', $.noop);
  router.del('/foo', $.noop);

  same(router._routeCollection[0].method, /^get$/)
  same(router._routeCollection[1].method, /^post$/)
  same(router._routeCollection[2].method, /^put$/)
  same(router._routeCollection[3].method, /^delete$/)
})

test("keeping a collection of before filters", function () {
  var router = factory('router')

  router.before($.noop)
  equal(router._filterCollection.before.length, 1, "should keep a collection of every before filter")
})

test("keeping a collection of after filters", function () {
  var router = factory('router')

  router.after($.noop)
  equal(router._filterCollection.after.length, 1, "should keep a collection of every before filter")
})

test("looking up a before filter with no path condition", function () {
  var router = factory('router')
  var filters = router.lookupBeforeFilter('get', '/foo')
  var callbackCalled = false;

  empty(filters, "should return an empty array if there are no filters")

  router.before(function () {
    callbackCalled = true;
  });

  var filters = router.lookupBeforeFilter('get', '/foo')

  equal(filters.length, 1, "should have found the filter")
  same(router._filterCollection.before[0], filters[0], "should return the filter that was added")

  filters[0].run({path: ""})

  ok(callbackCalled, "calling the route shoul invoke its callback")
})

test("looking up a before filter with a path condition", function () {
  var router = factory('router')
  var filters = router.lookupBeforeFilter('get', '/foo')
  var callbackCalled = false;

  empty(filters, "should return an empty array if there are no filters")

  router.before('/foo', function () {
    callbackCalled = true;
  });

  filters = router.lookupBeforeFilter('get', '/bar')
  empty(filters, "should return an empty array if the filter doesn't match")

  filters = router.lookupBeforeFilter('get', '/foo')

  equal(filters.length, 1, "should have found the filter")
  same(router._filterCollection.before[0], filters[0], "should return the filter that was added")

  filters[0].run({path: ""})

  ok(callbackCalled, "calling the route should invoke its callback")
})

test("looking up a after filter with no path condition", function () {
  var router = factory('router')
  var filters = router.lookupAfterFilter('get', '/foo')
  var callbackCalled = false;

  equal(filters.length, 0, "should return an empty array if there are no filters")

  router.after(function () {
    callbackCalled = true;
  });

  var filters = router.lookupAfterFilter('get', '/foo')

  equal(filters.length, 1, "should have found the filter")
  same(router._filterCollection.after[0], filters[0], "should return the filter that was added")

  filters[0].run({path: ""})

  ok(callbackCalled, "calling the route shoul invoke its callback")
})

test("looking up a before filter with a path condition", function () {
  var router = factory('router')
  var filters = router.lookupAfterFilter('get', '/foo')
  var callbackCalled = false;

  empty(filters, "should return an empty array if there are no filters")

  router.after('/foo', function () {
    callbackCalled = true;
  });

  filters = router.lookupAfterFilter('get', '/bar')
  empty(filters, "should return an empty array if the filter doesn't match")

  filters = router.lookupAfterFilter('get', '/foo')

  equal(filters.length, 1, "should have found the filter")
  same(router._filterCollection.after[0], filters[0], "should return the filter that was added")

  filters[0].run({path: ""})

  ok(callbackCalled, "calling the route should invoke its callback")
})

test("registering a state", function () {
  var router = factory('router')

  router._routeCollection = []

  router.state('/foo/:id', $.noop)

  var state = router._routeCollection[0]
  same(state, router.lookupRoute('state', '/foo/1'), "should store states as routes")
})

test("transitioning to a state", function () {
  var router = factory('router'),
      req

  Davis.history.onChange(function (r) {
    req = r
    start()
  })

  stop()
  router.trans('/blah/2')
  equal("/blah/2", req.path)
})