module("Davis.App")

test('Davis() fn should be optional', function(){
  ok(Davis() instanceof Davis.App, 'Davis() should return an app');
});

test("should auto start the application", function () {
  var app = Davis()
  ok(app.running, 'Davis() should auto start the app')
})

test("should only ever be one application", function () {
  var app1 = Davis(),
      app2 = Davis()

  same(app1, app2, 'davis app should be a singleton')
})

test("can only start an app that is stopped", function () {
  var startCount = 0,
      app = new Davis.App ()
      app.bind('start', function () {
        startCount++
      })

  app.start()
  app.start()

  equal(startCount, 1, 'should only be able to start an application when it is stopped')
})

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