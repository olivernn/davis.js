var empty = function (arr, message) {
  equal(0, arr.length, message)
}

var currentFullPath = function (path, message) {
  equal(window.location.pathname + (window.location.search ? window.location.search : ''), path, message)
}

var resetLocation = function () {
  window.history.replaceState({}, '', '/')
}

var createSpy = function() {
  var spy = function() {
    spy.mostRecentCall = { object: this, args: arguments };
    spy.calls.push(spy.mostRecentCall);
    spy.callCount++;
    spy.wasCalled = true;
  };

  spy.reset = function() {
    spy.wasCalled = false;
    spy.callCount = 0;
    spy.calls = [];
  };

  spy.reset();

  return spy;
};