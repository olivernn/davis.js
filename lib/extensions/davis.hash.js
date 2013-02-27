Davis.hash = function () {
  var handlers = [],
      lastPolledLocation

  var triggerHandlers = function (request) {
    Davis.utils.forEach(handlers, function (handler) {
      handler(request)
    })
  }

  var current = function () {
    return window.location.hash.replace(/^#?\/?/, '/')
  }

  var assign = function (req) {
    if (req.fullPath.indexOf('#') > -1 ) {
      req.fullPath = req.fullPath.split('#')[1]
      req.path = req.path.split('#')[1]
    }

    if (req.method === 'get') {
      window.location.hash = req.location()
    } else {
      triggerHandlers(req)
    }
  }

  var onChange = function (handler) {
    handlers.push(handler)
  }

  if ('onhashchange' in window) {
    Davis.$(window).bind('hashchange', function () {
      var request = new Davis.Request (current())
      triggerHandlers(request)
    })
  } else {
    setInterval(function () {
      if (lastPolledLocation != current()) {
        lastPolledLocation = current()
        var request = new Davis.Request (lastPolledLocation)

        triggerHandlers(request)
      }
    }, 200)
  }

  Davis.supported = function () {
    return true
  }

  Davis.location.setLocationDelegate({
    onChange: onChange,
    current: current,
    assign: assign,
    replace: assign
  })
}
