Davis.hashRouting = function () {
  Davis.location.setLocationDelegate((function () {

    var callbacks = []

    var current = function () {
      var hash
      if (hash = window.location.hash.replace(/^#!/, "")) {
        return hash
      } else {
        return "/"
      }
    }

    var assign = function (request) {
      if (request.location()) {
        window.location.hash = ["!", request.location()].join("")
      } else {
        callbacks.forEach(function (callback) {
          callback(request)
        })
      };
    }

    var onChange = function (callback) {
      callbacks.push(callback)

      jQuery(window).bind('hashchange', function (e) {
        callback(new Davis.Request({
          fullPath: current(),
          method: 'get'
        }))
      })
    }

    return {
      current: current,
      assign: assign,
      replace: assign,
      onChange: onChange
    }
  })())
}