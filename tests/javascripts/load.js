;(function () {

  var global = this

  var loadScript = function (src) {
    var script = document.createElement('script')
    script.src = src
    document.getElementsByTagName('head')[0].appendChild(script)
  }

  var load = function () {
    var scripts = Array.prototype.slice.call(arguments)
        condition = scripts[scripts.length - 1]

    if (typeof(condition) === "string") {
      condition = function () { return true }
    } else {
      scripts.pop()
    }

    for (var i=0; i < scripts.length; i++) {
      if (condition()) loadScript(scripts[i])
    };
  }

  global.load = load

})()