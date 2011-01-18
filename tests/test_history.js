module('History Module');

var resetHistory = function () {
  // I go back, way back, back in the day
  window.history.back(Infinity)
}

test("binding and triggering the push state event", function () {

  var callbackCalled = false;

  Davis.history.onChange(function (data) {
    callbackCalled = true;
  })

  ok(!callbackCalled, "callback shouldn't have been called yet")

  Davis.history.pushState({
    title: 'foo',
    path: '/bar.html'
  });

  ok(callbackCalled, "callback should have been called")

  resetHistory();
})

asyncTest("binding and triggering the pop state event", function () {
  var callbackCalled = false;

  Davis.history.pushState({
    title: 'foo',
    path: '/bar.html'
  });

  Davis.history.onChange(function () {
    callbackCalled = true;
    start();
  });

  ok(!callbackCalled, "callback shouldn't have been called yet")

  setTimeout(function () {
    window.history.back(1);
    ok(callbackCalled, "callback should have been called")
  }, 100)

  resetHistory();
})