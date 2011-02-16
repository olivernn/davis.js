module("Davis.App")

function getApp () {
  return new Davis.App
}

test("using a simple plugin", function () {
  var app = getApp()
  var plugin = function () {
    this.foo = "bar"
  }

  app.use(plugin)

  equal("bar", app.foo)
})

test("passing arguments to a plugin", function () {
  var app = getApp()
  var plugin = function (name) {
    this.name = name
  }

  app.use(plugin, "oliver")

  equal("oliver", app.name)
})

test("adding helpers to requests", function () {
  var app = getApp()

  app.helpers({
    foo: "bar"
  })

  var req = new Davis.Request({
    title: "asd",
    method: "asdf",
    fullPath: "asdf"
  })

  equal('bar', req.foo)
})