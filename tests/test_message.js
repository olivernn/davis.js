module("message")

test("simple message", function () {
  var msg = new Davis.Message('simple')

  equal('simple', msg.name, "should have a name property")
  equal('global', msg.namespace, "should be under global namespace since none was provided")
  equal(undefined, msg.data, "should not have any associated data")
})

test("message with data", function () {
  var msg = new Davis.Message('foo', {bar: true})

  same({bar: true}, msg.data, "should keep a reference to the message data")
})

test("namespaced message", function () {
  var msg = new Davis.Message('foo.bar');

  equal('bar', msg.namespace, "should use the namespace provided")
  equal('foo', msg.name, "name should not include the namespace")
})

test("message to String", function () {
  var msg = new Davis.Message('foo.bar')

  equal("MESSAGE foo.bar", msg.toString(), "should have a custom to string")
})