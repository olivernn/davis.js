module("pubsub")

function reset () {
  Davis.pubsub._subs = {}
}

test("subscribing to a global message", function () {
  reset()

  Davis.pubsub.subscribe('foo', $.noop);

  same($.noop, Davis.pubsub._subs.global.foo[0], "should keep track of handlers")
})

test("subscribing to a message multiple times", function () {
  reset()

  Davis.pubsub.subscribe('foo', $.noop)
  Davis.pubsub.subscribe('foo', 'blah')

  equal(2, Davis.pubsub._subs.global.foo.length, "should support multiple message handlers")
})

test("subscribing to namespaced messages", function () {
  reset()

  Davis.pubsub.subscribe('foo.bar', $.noop)
  Davis.pubsub.subscribe('foo', $.noop)

  equal(1, Davis.pubsub._subs.global.foo.length, "should have separate namespaces")
  equal(1, Davis.pubsub._subs.bar.foo.length, "should have separate namespaces")
})

test("unsubscribing from all global message", function () {
  reset()

  Davis.pubsub.subscribe('foo', $.noop)
  equal(1, Davis.pubsub._subs.global.foo.length, "should have separate namespaces")

  Davis.pubsub.unsubscribe('foo')
  equal(0, Davis.pubsub._subs.global.foo.length, "should have separate namespaces")
})

test("unsubscribing from a namespaced event", function () {
  reset()

  Davis.pubsub.subscribe('foo.bar', $.noop)
  Davis.pubsub.subscribe('foo', $.noop)
  equal(1, Davis.pubsub._subs.global.foo.length, "should have separate namespaces")
  equal(1, Davis.pubsub._subs.bar.foo.length, "should have separate namespaces")

  Davis.pubsub.unsubscribe('foo')
  equal(1, Davis.pubsub._subs.bar.foo.length, "should have separate namespaces")
  equal(0, Davis.pubsub._subs.global.foo.length, "should have separate namespaces")
  
})

test("unsubscribing an entire namespace", function () {
  reset()

  Davis.pubsub.subscribe('foo', $.noop)
  Davis.pubsub.subscribe('foo.bar', $.noop)
  Davis.pubsub.subscribe('baz.bar', $.noop)

  Davis.pubsub.unsubscribe('.bar')

  equal(1, Davis.pubsub._subs.global.foo.length, "shouldn't unsubscrive from messages in other namespaces")
  equal(undefined, Davis.pubsub._subs.bar, "should remove the whole namespace")
})

test("unsubscribe from a message that noone has subscribed to", function () {
  reset()

  Davis.pubsub.unsubscribe('foo')
})

test("looking up subscribers to a message", function () {
  reset()
  var message = new Davis.Message('foo')
  Davis.pubsub.subscribe('foo', $.noop)
  Davis.pubsub.subscribe('bar', true)

  same([$.noop], Davis.pubsub.lookupSubscribers(message), "should find all the subscribers for a message")
})

test("looking up subscribers to a message without any subscriptions", function () {
  reset()

  var message = new Davis.Message('foo')

  same([], Davis.pubsub.lookupSubscribers(message), "should return an empty array when there are no subscribers")
})