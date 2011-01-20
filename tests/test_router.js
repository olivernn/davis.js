module("Davis.router")

test("looking up a route", function () {
  Davis.router._routeCollection = [];

  Davis.router.get('/foo')
  Davis.router.post('/foo')

  var getRoute = Davis.router._routeCollection[0]
  var postRoute = Davis.router._routeCollection[1]

  equal(Davis.router.lookupRoute('get', '/foo'), getRoute, 'should match routes based on method and path')
  equal(Davis.router.lookupRoute('post', '/foo'), postRoute, 'should match routes based on method and path')
})

test("shortcuts for verbs", function () {

  Davis.router._routeCollection.length = 0;

  Davis.router.get('/foo', $.noop);
  Davis.router.post('/foo', $.noop);
  Davis.router.put('/foo', $.noop);
  Davis.router.del('/foo', $.noop);


  equal(Davis.router._routeCollection[0].method, 'get')
  equal(Davis.router._routeCollection[1].method, 'post')
  equal(Davis.router._routeCollection[2].method, 'put')
  equal(Davis.router._routeCollection[3].method, 'delete')

})