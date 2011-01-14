Davis.Interceptor = (function () {

  var links

  var bindAllLinks = function () {
    $(document).delegate('a', 'click', function (event) {
      var request = new Davis.Request (event);
      Davis.History.pushState(request, "asfd", request.path)
      return false;
    })
  }

  var bindAllForms = function () {
    $(document).delegate('form', 'submit', function (event) {
      // do stuff
    })
  }

  var enable = function () {
    bindAllForms();
    bindAllLinks();
  }

  return {
    enable: enable
  }
})()