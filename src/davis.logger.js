Davis.logger = (function () {

  var timestamp = function (){
    return "[" + Date() + "]";
  }

  var prepArgs = function (args) {
    var a = Array.prototype.slice.call(args)
    a.unshift(timestamp())
    return a
  }

  var error = function () {
    if (window.console) console.error.apply(console, prepArgs(arguments))
  }

  var info = function () {
    if (window.console) console.info.apply(console, prepArgs(arguments))
  }

  var warn = function () {
    if (window.console) console.warn.apply(console, prepArgs(arguments))
  }

  return {
    error: error,
    info: info,
    warn: warn
  }
})()