Davis.History = (function () {

  var pushStateHandlers = [];

  var onPushState = function (handler) {
    pushStateHandlers.push(handler);
  };

  var onPopState = function (handler) {
    window.addEventListener('popstate', handler);
  };

  var onChange = function (handler) {
    onPushState(handler);
    onPopState(handler);
  };

  var triggerPushState = function () {
    pushStateHandlers.forEach(function (handler) {
      handler();
    });
  };

  var pushState = function (req, title, path) {
    history.pushState(req, title, path);
    triggerPushState();
  };

  return {
    pushState: pushState,
    onChange: onChange
  }
})()