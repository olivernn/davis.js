var factory = function (name, attrs) {
  return factories[name](attrs)
}

factories = {
  request: function (attrs) {
    return new Davis.Request($.extend({
      method: 'get',
      fullPath: '/foo',
      title: 'foo'
    }, attrs))
  },

  route: function (attrs) {
    var opt = $.extend({
      method: 'get',
      path: '/foo',
      callback: $.noop
    }, attrs)

    return new Davis.Route (opt.method, opt.path, opt.callback)
  },

  router: function () {
    var obj = {}
    Davis.router.call(obj)
    return obj
  },

  events: function () {
    var obj = {}
    Davis.event.call(obj)
    return obj
  },

  app: function () {
    return new Davis.App ()
  }
}