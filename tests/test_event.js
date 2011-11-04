module("events")

test("binding to an event", function () {
  var events = factory('events'),
      callbackCalled = false;

  events.bind('foo', function () {
    callbackCalled = true;
  });

  events.trigger('foo');

  ok(callbackCalled, "callback should have been bound and run when the event was triggered");
})

test("passing data to an event handler", function () {
  var callbackCalled = false,
      callbackData = null,
      callbackContext = null,
      moreCallbackData = null,
      events = factory('events');

  events.bind('foo', function (data, moreData) {
    callbackCalled = true;
    callbackData = data;
    moreCallbackData = moreData;
    callbackContext = this;
  })

  events.trigger('foo', {
    foo: 'bar'
  }, {
    blah: 'halb'
  });

  ok(callbackCalled, "callback should have been bound and run when the event was triggered");
  same({foo: 'bar'}, callbackData, "should pass the callback data through to the handler");
  same({blah: 'halb'}, moreCallbackData, "should pass the callback data through to the handler");
  same(events, callbackContext, "should have this set to the app object");
})