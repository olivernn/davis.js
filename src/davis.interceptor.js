Davis.Interceptor = (function () {

  var links

  var handler = function (targetExtractor) {
    return function (event) {
      var request = new Davis.Request (targetExtractor.call($(event.target)));
      Davis.History.pushState(request)
      return false;
    };
  };

  var clickHandler = handler(function () {
    return {
      method: 'get',
      fullPath: this.attr('href'),
      title: this.attr('title')
    };
  });

  var submitHandler = handler(function () {
    return {
      method: this.attr('method'),
      fullPath: [this.attr('action'), "?", this.serialize()].join(""),
      title: this.attr('title')
    };
  });

  var enable = function () {
    $(document).delegate('form', 'submit', submitHandler)
    $(document).delegate('a', 'click', clickHandler)
  }

  return {
    enable: enable
  }
})()