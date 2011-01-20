module("Davis.router")

test("looking up a route", function () {
  var router = {}
  Davis.router.call(router)

  router._routeCollection = [];

  router.get('/foo')
  router.post('/foo')

  var getRoute = router._routeCollection[0]
  var postRoute = router._routeCollection[1]

  equal(router.lookupRoute('get', '/foo'), getRoute, 'should match routes based on method and path')
  equal(router.lookupRoute('post', '/foo'), postRoute, 'should match routes based on method and path')
})

test("shortcuts for verbs", function () {
  var router = {}
  Davis.router.call(router)

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