module("Davis.location")

var testLocationDelegate = {
  lastRequest: null,

  assign: function (request) {
    this.lastRequest = request
  },

  replace: function (request) {
    this.lastRequest = request
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