module("Davis.location")

var testLocationDelegate = {
  lastRequest: null,
  lastOptions: null,

  assign: function (request, opts) {
    this.lastRequest = request
    this.lastOptions = opts
  },

  replace: function (request, opts) {
    this.lastRequest = request
    this.lastOptions = opts
  }
}

test("assign accepts a string and converts it to a request", function () {
  Davis.location.setLocationDelegate(testLocationDelegate)

  Davis.location.assign('/posts/12')

  ok(testLocationDelegate.lastRequest instanceof Davis.Request, 'should be an instance of Davis.Request')
  equal(testLocationDelegate.lastRequest.method, 'get', 'should default to a get request')
  equal(testLocationDelegate.lastRequest.fullPath, '/posts/12', 'should pass the path to the request')

  Davis.location.setLocationDelegate(Davis.history)
})

test("replace accepts a string and converts it to a request", function () {
  Davis.location.setLocationDelegate(testLocationDelegate)

  Davis.location.replace('/posts/12')

  ok(testLocationDelegate.lastRequest instanceof Davis.Request, 'should be an instance of Davis.Request')
  equal(testLocationDelegate.lastRequest.method, 'get', 'should default to a get request')
  equal(testLocationDelegate.lastRequest.fullPath, '/posts/12', 'should pass the path to the request')

  Davis.location.setLocationDelegate(Davis.history)
})

test("assign takes a request object", function () {
  Davis.location.setLocationDelegate(testLocationDelegate)

  var request = new Davis.Request('/posts/12')

  Davis.location.assign(request)

  ok(testLocationDelegate.lastRequest instanceof Davis.Request, 'should be an instance of Davis.Request')
  equal(testLocationDelegate.lastRequest.method, 'get', 'should default to a get request')
  equal(testLocationDelegate.lastRequest.fullPath, '/posts/12', 'should pass the path to the request')

  Davis.location.setLocationDelegate(Davis.history)
})

test("replace takes a request object", function () {
  Davis.location.setLocationDelegate(testLocationDelegate)

  var request = new Davis.Request('/posts/12')

  Davis.location.replace(request)

  ok(testLocationDelegate.lastRequest instanceof Davis.Request, 'should be an instance of Davis.Request')
  equal(testLocationDelegate.lastRequest.method, 'get', 'should default to a get request')
  equal(testLocationDelegate.lastRequest.fullPath, '/posts/12', 'should pass the path to the request')

  Davis.location.setLocationDelegate(Davis.history)
})

test("assign takes an options object and passes it to the delegate", function () {
  Davis.location.setLocationDelegate(testLocationDelegate)
  testLocationDelegate.lastOptions = {}

  Davis.location.assign('/posts/12', { silent: true })

  ok(testLocationDelegate.lastOptions.silent)

  Davis.location.setLocationDelegate(Davis.history)
})

test("replace takes an options object and passes it to the delegate", function () {
  Davis.location.setLocationDelegate(testLocationDelegate)
  testLocationDelegate.lastOptions = {}

  Davis.location.replace('/posts/12', { silent: true })

  ok(testLocationDelegate.lastOptions.silent)

  Davis.location.setLocationDelegate(Davis.history)
})
