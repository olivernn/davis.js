module('hashRouting Extension');

test("location delegate", function() {
  mockDavis = { 
    location: {
      setLocationDelegate: createSpy()
    },
    supported: function() { return true; }
  };

  var mockLocation = {
    pathname: '/',
    hash: '#',
    assign: createSpy(),
    replace: createSpy(),
  };

  var extension = Davis.hashRouting({
    forceHashRouting: true,
    location: mockLocation
  });

  extension(mockDavis);

  /**
    * Extension should set a new location delegate
    */
  ok(mockDavis.location.setLocationDelegate.wasCalled);
  locationDelegate = mockDavis.location.setLocationDelegate.mostRecentCall.args[0];

  /**
    * Test onChange callback
    */
  var onChangeCallback = createSpy();
  locationDelegate.onChange(onChangeCallback);

  mockLocation.hash = "#/somewhere_else"
  jQuery(window).trigger('hashchange');
  ok(onChangeCallback.wasCalled);

  /**
    * Test assign
    */
  onChangeCallback.reset();
  mockLocation.assign.reset();

  var request = new Davis.Request({ fullPath: '/hello_assign_test', method: 'get' });
  locationDelegate.assign(request);

  ok(onChangeCallback.wasCalled);
  ok(mockLocation.assign.wasCalled);
  equal(mockLocation.assign.mostRecentCall.args[0], '#/hello_assign_test');

  /**
    * Test replace
    */
  onChangeCallback.reset();
  mockLocation.assign.reset();

  var request = new Davis.Request({ fullPath: '/hello_replace_test', method: 'get' });
  locationDelegate.replace(request);

  ok(onChangeCallback.wasCalled);
  ok(mockLocation.replace.wasCalled);
  equal(mockLocation.replace.mostRecentCall.args[0], '#/hello_replace_test');

  /**
    * Test silent assign
    */
  onChangeCallback.reset();
  mockLocation.assign.reset();

  var request = new Davis.Request({ fullPath: '/hello_assign_silent_test', method: 'get' });
  locationDelegate.assign(request, {silent: true});

  ok(!onChangeCallback.wasCalled);
  ok(mockLocation.assign.wasCalled);
  equal(mockLocation.assign.mostRecentCall.args[0], '#/hello_assign_silent_test');

  /**
    * Test replace
    */
  onChangeCallback.reset();
  mockLocation.assign.reset();

  var request = new Davis.Request({ fullPath: '/hello_replace_test', method: 'get' });
  locationDelegate.replace(request, {silent: true});

  ok(!onChangeCallback.wasCalled);
  ok(mockLocation.replace.wasCalled);
  equal(mockLocation.replace.mostRecentCall.args[0], '#/hello_replace_test');
});

test("normalizing the initial value of window.location", function() {

  /**
    * test helper
    */
  function normalizationTest(forceHashRouting, pathname, hash, prefix) {
    var mockLocation = {
      pathname: pathname,
      hash: hash,
      replace: createSpy()
    };

    var extension = Davis.hashRouting({
      forceHashRouting: forceHashRouting,
      location: mockLocation,
      normalizeInitialLocation: true,
      prefix: prefix
    });

    extension(Davis);

    if(mockLocation.replace.mostRecentCall)
      return mockLocation.replace.mostRecentCall.args[0];
    else
      return null;
  }

  var result;

  /**
    * Test when history API is supported
    */
  if ((typeof window.history.pushState == 'function')) {
    result = normalizationTest(false, '/foo', '#/bar');
    equal(result, '/bar');

    result = normalizationTest(false, '/', '#/foobar');
    equal(result, '/foobar');

    result = normalizationTest(false, '/foobar', '');
    equal(result, null);
  };

  /**
    * Test when history API is not supported
    */
  result = normalizationTest(true, '/woot', '');
  equal(result, '/#/woot');

  result = normalizationTest(true, '/woot', '#/foobar');
  equal(result, '/#/foobar');

  result = normalizationTest(true, '/woot', '', '!');
  equal(result, '/#!/woot');


  result = normalizationTest(true, '/woot', '#!/foobar', '!');
  equal(result, '/#!/foobar');

  result = normalizationTest(true, '/', '#/foobar');
  equal(result, null);

  // Cleanup
  Davis.location.setLocationDelegate(Davis.history);
});