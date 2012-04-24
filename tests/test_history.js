module('History Module');

test("binding and triggering the push state event", function () {

  var callbackCount = 0;

  Davis.history.onChange(function (data) {
    callbackCount++
  })

  ok(!callbackCount, "callback shouldn't have been called yet")

  Davis.history.assign(factory('request'));
  ok(callbackCount, "callback should have been called")
  resetLocation()

  Davis.history.replace(factory('request'));
  equal(2, callbackCount, "call back should have been called again for replace state")

  resetLocation()
})

test("url should be changed to the requests url on pushState", function () {
  var req1= factory('request', {
    fullPath: "/eggs"
  })

  Davis.history.assign(req1)
  currentFullPath(req1.location(), "location pathname should be equal to request location")

  resetLocation()
})

test("url should be changed to the requests url on pushState", function () {
  var req1= factory('request', {
    fullPath: "/eggs?and=ham"
  })

  Davis.history.assign(req1)
  currentFullPath(req1.location(), "location pathname should be equal to request location")

  resetLocation()
})

test("url should be changed to the requests url on replace state", function () {
  var req2 = factory('request', {
    fullPath: "/ham"
  })

  Davis.history.replace(req2)
  currentFullPath(req2.location(), "location pathname should be equal to request location")

  resetLocation()
})

test("binding and triggering the pop state event", function () {
  var callbackCalled = false;

  Davis.history.onChange(function () {
    callbackCalled = true;
    start();
  });

  window.history.pushState('foo', 'foo')

  ok(!callbackCalled, "callback shouldn't have been called yet")

  setTimeout(function () {
    window.history.back(1);
    ok(callbackCalled, "callback should have been called")
    resetLocation()
  }, 101)
})

test("silent assigns should not call onpushstate handlers", function () {
  var callbackCalled = false,
      req = factory('request', {fullPath: '/foo'})

  Davis.history.onChange(function () {
    callbackCalled = true
  })

  Davis.history.assign(req, {silent: true})

  ok(!callbackCalled, "should not call any of the callbacks")
  currentFullPath("/foo", "location pathname should be equal to request location")

  resetLocation()
})

test("silent replaces should not call onpushstate handlers", function () {
  var callbackCalled = false,
      req = factory('request', {fullPath: '/foo'})

  Davis.history.onChange(function () {
    callbackCalled = true
  })

  Davis.history.replace(req, {silent: true})

  ok(!callbackCalled, "should not call any of the callbacks")
  currentFullPath("/foo", "location pathname should be equal to request location")

  resetLocation()
})
