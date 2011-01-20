module("Davis.router")

var mockRouter = function () {
  var router = {};
  Davis.router.call(router);
  return router;
}

test("looking up a route", function () {
  var router = mockRouter();
  router._routeCollection = [];

  router.get('/foo')
  router.post('/foo')

  var getRoute = router._routeCollection[0]
  var postRoute = router._routeCollection[1]

  equal(router.lookupRoute('get', '/foo'), getRoute, 'should match routes based on method and path')
  equal(router.lookupRoute('post', '/foo'), postRoute, 'should match routes based on method and path')
})

test("shortcuts for verbs", function () {
  var router = mockRouter();

  router._routeCollection.length = 0;
  router.get('/foo', $.noop);
  router.post('/foo', $.noop);
  router.put('/foo', $.noop);
  router.delete('/foo', $.noop);

  equal(router._routeCollection[0].method, 'get')
  equal(router._routeCollection[1].method, 'post')
  equal(router._routeCollection[2].method, 'put')
  equal(router._routeCollection[3].method, 'delete')
})

test("keeping a collection of before filters", function () {
  var router = mockRouter();

  router.before($.noop)
  equal(router._filterCollection.before.length, 1, "should keep a collection of every before filter")
})

test("keeping a collection of after filters", function () {
  var router = mockRouter();

  router.after($.noop)
  equal(router._filterCollection.after.length, 1, "should keep a collection of every before filter")
})

test("looking up a before filter", function () {
  var router = mockRouter();
  var filters = router.lookupBeforeFilter('get', '/foo')
  var callbackCalled = false;

  equal(filters.length, 0, "should return an empty array if there are no filters")

  router.before(function () {
    callbackCalled = true;
  });

  
})