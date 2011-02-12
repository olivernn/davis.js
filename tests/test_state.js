module("state")

test("simple state", function () {
  var state = new Davis.State('simple')

  equal('simple', state.name, "should have a name property")
  equal('global', state.namespace, "should be under global namespace since none was provided")
  equal(undefined, state.data, "should not have any associated data")
})

test("state with data", function () {
  var state = new Davis.State('foo', {bar: true})

  same({bar: true}, state.data, "should keep a reference to the state data")
})

test("namespaced state", function () {
  var state = new Davis.State('foo.bar');

  equal('bar', state.namespace, "should use the namespace provided")
  equal('foo', state.name, "name should not include the namespace")
})

test("state to String", function () {
  var state = new Davis.State('foo.bar')

  equal("STATE foo.bar", state.toString(), "should have a custom to string")
})