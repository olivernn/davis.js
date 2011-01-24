module("events")

test("binding to an event", function () {

  var callbackCalled = false;

  Davis.event.bind('foo', function () {
    callbackCalled = true;
  });

  Davis.event.trigger('foo');

  ok(callbackCalled, "callback should have been bound and run when the event was triggered");
})

test("passing data to an event handler", function () {
  var callbackCalled = false;
  var callbackData = null;
  var callbackContext = null;
  var moreCallbackData = null;

  Davis.event.bind('foo', function (data, moreData) {
    callbackCalled = true;
    callbackData = data;
    moreCallbackData = moreData;
    callbackContext = this;
  })

  Davis.event.trigger('foo', {
    foo: 'bar'
  }, {
    blah: 'halb'
  });

  ok(callbackCalled, "callback should have been bound and run when the event was triggered");
  same({foo: 'bar'}, callbackData, "should pass the callback data through to the handler");
  same({blah: 'halb'}, moreCallbackData, "should pass the callback data through to the handler");
  same(Davis.event, callbackContext, "should have this set to the app object");
})