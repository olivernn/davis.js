module("Davis.App")

test('Davis() fn should be optional', function(){
  Davis.extend(Davis.hashRouting())
  ok(Davis() instanceof Davis.App, 'Davis() should return an app');
});

test("should auto start the application", function () {
  Davis.extend(Davis.hashRouting())
  var app = Davis()
  ok(app.running, 'Davis() should auto start the app')
})

test("can only start an app that is stopped", function () {
  Davis.extend(Davis.hashRouting())
  var startCount = 0,
      app = factory('app');

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