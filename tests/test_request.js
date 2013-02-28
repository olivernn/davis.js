module("Request Module");

test("request without any params", function () {
  var request = factory('request')

  equal('get', request.method, "should store the request method");
  equal('/foo', request.path, "should store the request path");
  equal('/foo', request.fullPath, "should store the full request path");
  equal('foo', request.title, "should store the title for the request");
  ok(!request.queryString, "should have no query string");
  same({}, request.params, "should have no params");
});

test("request with a full url", function() {
  var request = factory('request', {fullPath: 'http://www-1.example.com:80/users/john-smith.html'});
  equal(request.location(), '/users/john-smith.html', "should remove the host and protocol parts");
});

test("request with a full url with params", function() {
  var request = factory('request', {fullPath: 'http://www-1.example.com:80/users?name=john-smith'});
  equal(request.location(), '/users?name=john-smith', "should remove the host and protocol parts");
});

test("request with params", function () {
  var request = factory('request', {
    method: 'post',
    fullPath: '/foo?bar=baz'
  })

  equal('post', request.method, "should store the request method");
  equal('/foo', request.path, "should store the path without any of the query params");
  equal('foo', request.title, "should store the title for the request");
  equal('bar=baz', request.queryString, "should store the query string");
  equal('/foo?bar=baz', request.fullPath, "should store the full request path");
  same({bar: "baz"}, request.params, "should add any params to the request params object");
});

test("request with params including new lines", function () {
  var request = factory('request', {
    method: 'post',
    fullPath: '/foo?bar=baz\nzab'
  })

  equal('/foo', request.path)
})

test("handling escaped params properly", function () {
  var escapedPath = '/search?query=foo+bar%20%26zoo%3Dgoo'
  var request = factory('request', {
    method: 'get',
    fullPath: escapedPath
  })

  equal('/search', request.path)
  equal('/search?query=foo%20bar%20%26zoo%3Dgoo', request.location())
  equal('foo bar &zoo=goo', request.params.query)
})

test("convert request to readable string", function () {
  var request = factory('request', {
    method: 'post',
    fullPath: '/foo?bar=baz'
  })

  equal('POST /foo', request.toString(), "should include the method and the path")
})

test("using _method param will set the method of the request", function () {
  var request = factory('request', {
    fullPath: '/foo?_method=put&name=bob'
  });

  equal('put', request.method, "should use the _method param to set the requests method")
})

test("parsing rails style nested params", function () {
  var request = factory('request', {
    fullPath: '/foo?note[name]=123&note[title]=asdf'
  })

  same({note: {
    name: '123',
    title: 'asdf'
  }}, request.params, "should combine the nested params into a separate object under params")
})

test("parsing rails style nested params with arrays", function () {
  var request = factory('request', {
    fullPath: '/foo?note[ids][]=123&note[ids][]=asdf&note[bars][]=1&note[bars][]=2&note[li]=li'
  })

  same({note: {
    ids: ['123','asdf'],
    bars: ['1', '2'],
    li: 'li'
  }}, request.params, "should combine the nested params into a single array")
})

test("parsing top level rails style nested params with arrays", function () {
  var request = factory('request', {
    fullPath: '/foo?ids[]=123&ids[]=asdf&bars[]=1&bars[]=2&foo=li'
  })

  same({
    ids: ['123', 'asdf'],
    bars: ['1', '2'],
    foo: 'li'
  }, request.params, "should combine the nested params into a single array")

})

test("generating a request for the initial page load", function () {
  var request = Davis.Request.forPageLoad()

  equal('get', request.method, "should have a method of get")
  equal(window.location.pathname, request.path, "should have the current location path as the path")
  equal(document.title, request.title, "should take the current page title as the title")
})

test("adding a whenStale callback", function () {
  var request = factory('request')

  var staleCallback = function () {};
  request.whenStale(staleCallback)
  same(staleCallback, request._staleCallback)
})

test("marking a request as stale", function () {
  var request = factory('request')
  var callbackCalled = false;

  request.whenStale(function () {
    callbackCalled = true
  })
  request.makeStale();

  ok(callbackCalled, "marking a request as stale should call the whenStale callback")
})

test("passing the next request in to the whenStale callback", function () {
  var request = factory('request')
  var callbackReq

  request.whenStale(function (nextReq) {
    callbackReq = nextReq
    start()
  })

  stop()
  var nextRequest = factory('request')

  same(callbackReq, nextRequest, "the next request should be passed as a parameter to the when stale callback")
})

test("request has a location that the page url is changed too", function () {
  var getRequest = factory('request')

  var postRequest = factory('request', {
    method: 'post'
  })

  var putRequest = factory('request', {
    method: 'put'
  })

  var deleteRequest = factory('request', {
    method: 'delete'
  })

  var stateRequest = factory('request', {
    method: 'state'
  })

  equal(getRequest.path, getRequest.location(), "get requests should have a location that matches the path")
  equal('', postRequest.location(), "post requests should have a blank location")
  equal('', putRequest.location(), "put requests should have a blank location")
  equal('', deleteRequest.location(), "delete requests should have a blank location")
  equal('', stateRequest.location(), "state requests should have a blank location")
})

test("pass a request to the server", function () {
  var serverCalled = false

  var request = factory('request', {
    delegateToServer: function () {
      serverCalled = true
    }
  })

  request.delegateToServer()

  ok(serverCalled, "should have delegated responsibility for the route to the server")
})

test("request method should always be lower case", function () {
  var request = factory('request', {
    method: 'GET'
  })

  equal('get', request.method, "should lowwer case the request method")
})

test("flagging a request as a page load request", function () {
  var request = factory('request')
  var pageLoad = Davis.Request.forPageLoad()

  ok(!request.isForPageLoad, "request should not be for the page load")
  ok(pageLoad.isForPageLoad, "request should be for the page load")
})

test("can construct a request from a string", function () {
  var request = new Davis.Request ('/posts/12')

  equal(request.method, 'get', 'should default the method to get')
  equal(request.title, '', 'should leave the title empty')
  equal(request.fullPath, '/posts/12', 'should set the fullPath to the string passed to the constructor')
})

test("all params should be decoded from uri params", function () {
  var request = factory('request', {
    fullPath: '/foo?email=oliver%40mail.com'
  })

  equal(request.params.email, 'oliver@mail.com', 'should decodeURIComponent')
})

test("requests should have a timestamp property", function () {
  var request = factory('request')

  ok(request.timestamp)
  setTimeout(function () {
    var laterRequest = factory('request')
    ok(request.timestamp < laterRequest.timestamp)
  }, 30)
})
