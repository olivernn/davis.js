Davis.Interceptor = (function () {

  var handler = function (targetExtractor) {
    return function (event) {
      var request = new Davis.Request (targetExtractor.call($(event.target)));
      Davis.history.pushState(request);
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

  var listen = function () {
    $(document).delegate(this.settings.formSelector, 'submit', submitHandler)
    $(document).delegate(this.settings.linkSelector, 'click', clickHandler)
  }

  return {
    listen: listen
  }
})()