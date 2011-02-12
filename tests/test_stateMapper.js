module("stateMapper")

function reset () {
  Davis.stateMapper._actions = {}
}

test("registering a global state", function () {
  reset()

  Davis.stateMapper.state('foo', $.noop);

  same($.noop, Davis.stateMapper._actions.global.foo[0], "should keep track of handlers")
})

test("registering a state multiple times", function () {
  reset()

  Davis.stateMapper.state('foo', $.noop)
  Davis.stateMapper.state('foo', 'blah')

  equal(2, Davis.stateMapper._actions.global.foo.length, "should support multiple state handlers")
})

test("registering namespaced states", function () {
  reset()

  Davis.stateMapper.state('foo.bar', $.noop)
  Davis.stateMapper.state('foo', $.noop)

  equal(1, Davis.stateMapper._actions.global.foo.length, "should have separate namespaces")
  equal(1, Davis.stateMapper._actions.bar.foo.length, "should have separate namespaces")
})

test("unregistering from all global state", function () {
  reset()

  Davis.stateMapper.state('foo', $.noop)
  equal(1, Davis.stateMapper._actions.global.foo.length, "should have separate namespaces")

  Davis.stateMapper.clearState('foo')
  equal(0, Davis.stateMapper._actions.global.foo.length, "should have separate namespaces")
})

test("unregistering from a namespaced event", function () {
  reset()

  Davis.stateMapper.state('foo.bar', $.noop)
  Davis.stateMapper.state('foo', $.noop)
  equal(1, Davis.stateMapper._actions.global.foo.length, "should have separate namespaces")
  equal(1, Davis.stateMapper._actions.bar.foo.length, "should have separate namespaces")

  Davis.stateMapper.clearState('foo')
  equal(1, Davis.stateMapper._actions.bar.foo.length, "should have separate namespaces")
  equal(0, Davis.stateMapper._actions.global.foo.length, "should have separate namespaces")
  
})

test("unregistering an entire namespace", function () {
  reset()

  Davis.stateMapper.state('foo', $.noop)
  Davis.stateMapper.state('foo.bar', $.noop)
  Davis.stateMapper.state('baz.bar', $.noop)

  Davis.stateMapper.clearState('.bar')

  equal(1, Davis.stateMapper._actions.global.foo.length, "shouldn't unsubscrive from states in other namespaces")
  equal(undefined, Davis.stateMapper._actions.bar, "should remove the whole namespace")
})

test("unregister a state that has no action", function () {
  reset()

  Davis.stateMapper.clearState('foo')
})

test("looking up actions for a state", function () {
  reset()
  var state = new Davis.State('foo')
  Davis.stateMapper.state('foo', $.noop)
  Davis.stateMapper.state('bar', true)

  same([$.noop], Davis.stateMapper.lookupStates(state), "should find all the subscribers for a state")
})

test("looking up actions for a state without any actions", function () {
  reset()

  var state = new Davis.State('foo')

  same([], Davis.stateMapper.lookupStates(state), "should return an empty array when there are no subscribers")
})