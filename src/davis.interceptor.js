Davis.Interceptor = (function () {

  var links

  var bindAllLinks = function () {
    $(document).delegate('a', 'click', function (event) {
      var target = $(event.target);
      var request = new Davis.Request ({
        method: 'get',
        fullPath: target.attr('href')
      });
      Davis.History.pushState(request, "asfd", request.path)
      return false;
    })
  }

  var bindAllForms = function () {
    $(document).delegate('form', 'submit', function (event) {
      var target = $(event.target);
      var request = new Davis.Request ({
        method: target.attr('method'),
        fullPath: [target.attr('action'), "?", target.serialize()].join("")
      });
      Davis.History.pushState(request, "form", request.path)
      return false;
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