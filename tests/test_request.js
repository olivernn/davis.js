module("Request Module");

test("request without any params", function () {
  var request = new Davis.Request ({
    method: 'get',
    fullPath: '/foo',
    title: 'foo'
  });

  equal('get', request.method, "should store the request method");
  equal('/foo', request.path, "should store the request path");
  equal('foo', request.title, "should store the title for the request");
  ok(!request.queryString, "should have no query string");
  same({}, request.params, "should have no params");
});

test("request with params", function () {
  var request = new Davis.Request({
    method: 'post',
    fullPath: '/foo?bar=baz',
    title: 'foo'
  });

  equal('post', request.method, "should store the request method");
  equal('/foo', request.path, "should store the path without any of the query params");
  equal('foo', request.title, "should store the title for the request");
  equal('bar=baz', request.queryString, "should store the query string");
  same({bar: "baz"}, request.params, "should add any params to the request params object");
});

test("convert request to readable string", function () {
  var request = new Davis.Request({
    method: 'post',
    fullPath: '/foo?bar=baz',
    title: 'foo'
  });

  equal('POST /foo', request.toString(), "should include the method and the fullPath")
})