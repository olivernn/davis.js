Davis.Interceptor = (function () {

  var links

  var bindAllLinks = function () {
    document.addEventListener('click', function (event) {
      if (event.target.nodeName === "A") {
        new Davis.Request
      };
    })
  }

  var enable = function () {
    
  }

  return {
    enable: enable
  }
})()