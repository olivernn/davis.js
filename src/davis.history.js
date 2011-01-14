Davis.History = (function () {

  var pushStateHandlers = [];

  var onPushState = function (handler) {
    pushStateHandlers.push(handler);
  };

  var onPopState = function (handler) {
    window.addEventListener('popstate', handler);
  };

  var wrapped = function (handler) {
    return function (event) {
      if (event.state) {
        handler(event.state)
      };
    }
  }

  var onChange = function (handler) {
    onPushState(handler);
    onPopState(wrapped(handler));
  };

  var pushState = function (req, title, path) {
    history.pushState(req, title, path);
    pushStateHandlers.forEach(function (handler) {
      handler(req);
    });
  };

  return {
    pushState: pushState,
    onChange: onChange
  }
})()