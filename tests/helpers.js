var empty = function (arr, message) {
  equal(0, arr.length, message)
}

var currentPathname = function (pathname, message) {
  equal(window.location.pathname, pathname, message)
}

var resetLocation = function () {
  window.history.replaceState({}, '', '/')
}