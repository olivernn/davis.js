module("Davis.App")

test("using a simple plugin", function () {
  var app = factory('app')
  var plugin = function () {
    this.foo = "bar"
  }

  app.use(plugin)

  equal("bar", app.foo)
})

test("passing arguments to a plugin", function () {
  var app = factory('app')
  var plugin = function (name) {
    this.name = name
  }

  app.use(plugin, "oliver")

  equal("oliver", app.name)
})

test("adding helpers to requests", function () {
  var app = factory('app')

  app.helpers({
    foo: "bar"
  })

  var req = factory('request')
  equal('bar', req.foo)
})