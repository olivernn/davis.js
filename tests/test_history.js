module('History Module');

var resetHistory = function () {
  // I go back, way back, back in the day
  window.history.back(Infinity)
}

test("binding and triggering the push state event", function () {

  var callbackCalled = false;

  Davis.History.onChange(function (data) {
    callbackCalled = true;
  })

  ok(!callbackCalled, "callback shouldn't have been called yet")

  Davis.History.pushState({
    title: 'foo',
    path: '/bar.html'
  });

  ok(callbackCalled, "callback should have been called")

  resetHistory();
})

asyncTest("binding and triggering the pop state event", function () {
  var callbackCalled = false;

  Davis.History.pushState({
    title: 'foo',
    path: '/bar.html'
  });

  Davis.History.onChange(function () {
    callbackCalled = true;
    start();
  });

  ok(!callbackCalled, "callback shouldn't have been called yet")

  setTimeout(function () {
    window.history.back(10);
    ok(callbackCalled, "callback should have been called")
  }, 100)

  resetHistory();
})