Davis.location = (function () {

  var locationDelegate = Davis.history

  var setLocationDelegate = function (delegate) {
    locationDelegate = delegate
  }

  var current = function () {
    return locationDelegate.current()
  }

  var assign = function (req) {
    locationDelegate.assign(req)
  }

  var replace = function (req) {
    locationDelegate.replace(req)
  }

  var onChange = function (handler) {
    locationDelegate.onChange(handler)
  }

  return {
    setLocationDelegate: setLocationDelegate,
    current: current,
    assign: assign,
    replace: replace,
    onChange: onChange
  }
})()