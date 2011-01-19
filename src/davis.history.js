Davis.history = (function () {

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
      } else {
        handler(Davis.Request.forPageLoad())
      };
    }
  }

  var onChange = function (handler) {
    onPushState(handler);
    onPopState(wrapped(handler));
  };

  var pushState = function (request) {
    history.pushState(request, request.title, request.path);
    pushStateHandlers.forEach(function (handler) {
      handler(request);
    });
  };

  var replaceState = function (request) {
    history.replaceState(request, request.title, request.path);
    pushStateHandlers.forEach(function (handler) {
      handler(request);
    });
  };

  return {
    replaceState: replaceState,
    pushState: pushState,
    onChange: onChange
  }
})()