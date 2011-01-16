module("Request Module")

test("request without any params", function () {
  var request = new Davis.Request ({
    method: 'get',
    fullPath: '/foo'
  });

  equal('get', request.method, "should store the request method");
  equal('/foo', request.path, "should store the request path");
  same({}, request.params, "should have no params");
});

test("request with params", function () {
  var request = new Davis.Request({
    method: 'post',
    fullPath: '/foo?bar=baz'
  });

  equal('post', request.method, "should store the request method");
  equal('/foo', request.path, "should store the path without any of the query params");
  same({bar: "baz"}, request.params, "should add any params to the request params object");
});