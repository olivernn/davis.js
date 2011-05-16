module("Davis.utils")

test("where every element passes the test", function () {
  var a = [1,2,3]
  var result = Davis.utils.every(a, function (element) {
    return element < 10
  })

  ok(result, "every element of the array is less than 10")
})

test("where one of the items doesn't pass the test", function () {
  var a = [1,2,3]
  var result = Davis.utils.every(a, function (element) {
    return element < 2
  })

  ok(!result, "not every element of the array is less than 2")
})

test("should only call the callback whilst the test is passing", function () {
  var a = [1,2,3]
  var count = 0
  var result = Davis.utils.every(a, function (element) {
    count++
    return element < 2
  })

  ok(!result, "not every element of the array is less than 2")
  equal(2, count, "should stop iterating as soon as the test is false")
})

test("arguments passed to the function", function () {
  var a = ["foo"],
      b, element, index

  Davis.utils.every(a, function (e, i, array) {
    b = array
    element = e
    index = i
    return true
  })

  equal(element, "foo", "should yield the element of the array as the first argument")
  equal(index, 0, "should yield the index of the item in the array as the second argument")
  same(b, a, "should yeild the array being iterated as the third argument")
})

test("setting the context of the callback function", function () {
  var a = ["foo"],
      context = {},
      self

  Davis.utils.every(a, function () {
    self = this
  }, context)

  same(self, context, "should be able to set the context of the function")
})

test("iterating over an array", function () {
  var a = [1,2,3],
      b = [],
      count = 0

  Davis.utils.forEach(a, function (item) {
    count++
    b.push(item)
  })

  same(a, b, "should have iterated over the items in the array")
  equal(count, a.length, "should have yeilded to the function for every item in the array")
})

test("iterating over an empty array", function () {
  var a = [],
      count = 0

  Davis.utils.forEach(a, function (item) {
    count++
  })

  equal(count, a.length, "shouldn't yield to the function at all since the array was empty")
})

test("arguments passed to the function", function () {
  var a = ["foo"],
      b, element, index

  Davis.utils.forEach(a, function (e, i, array) {
    b = array
    element = e
    index = i
  })

  equal(element, "foo", "should yield the element of the array as the first argument")
  equal(index, 0, "should yield the index of the item in the array as the second argument")
  same(b, a, "should yeild the array being iterated as the third argument")
})

test("setting the context of the callback function", function () {
  var a = ["foo"],
      context = {},
      self

  Davis.utils.forEach(a, function () {
    self = this
  }, context)

  same(self, context, "should be able to set the context of the function")
})

test("when the filter returns true", function () {
  var a = [1,2,3],
      result

  result = Davis.utils.filter(a, function (element) {
    return true
  })

  same(a, result, "should only return elements of the array that the function returned true for")
})

test("whent he filter always returns false", function () {
  var a = [1,2,3],
      result

  result = Davis.utils.filter(a, function (element) {
    return false
  })

  same([], result, "should only return elements of the array that the function returned true for")
})

test("when the function returns false sometimes", function () {
  var a = [1,2,3],
      result

  result = Davis.utils.filter(a, function (element) {
    return (element !== 3)
  })

  same([1,2], result, "should only return elements of the array that the function returned true for")
})

test("arguments passed to the function", function () {
  var a = ["foo"],
      b, element, index

  Davis.utils.filter(a, function (e, i, array) {
    b = array
    element = e
    index = i
  })

  equal(element, "foo", "should yield the element of the array as the first argument")
  equal(index, 0, "should yield the index of the item in the array as the second argument")
  same(b, a, "should yeild the array being iterated as the third argument")
})

test("setting the context of the callback function", function () {
  var a = ["foo"],
      context = {},
      self

  Davis.utils.filter(a, function () {
    self = this
  }, context)

  same(self, context, "should be able to set the context of the function")
})

test("iterating over an array", function () {
  var a = [1,2,3],
      b = [],
      count = 0

  Davis.utils.map(a, function (item) {
    count++
    b.push(item)
  })

  same(a, b, "should have iterated over the items in the array")
  equal(count, a.length, "should have yeilded to the function for every item in the array")
})

test("iterating over an empty array", function () {
  var a = [],
      count = 0

  Davis.utils.map(a, function (item) {
    count++
  })

  equal(count, a.length, "shouldn't yield to the function at all since the array was empty")
})

test("arguments passed to the function", function () {
  var a = ["foo"],
      b, element, index

  Davis.utils.map(a, function (e, i, array) {
    b = array
    element = e
    index = i
  })

  equal(element, "foo", "should yield the element of the array as the first argument")
  equal(index, 0, "should yield the index of the item in the array as the second argument")
  same(b, a, "should yeild the array being iterated as the third argument")
})

test("setting the context of the callback function", function () {
  var a = ["foo"],
      context = {},
      self

  Davis.utils.map(a, function () {
    self = this
  }, context)

  same(self, context, "should be able to set the context of the function")
})

test("returning a new array with the result of the function", function () {
  var a = [1,2,3],
      output

  output = Davis.utils.map(a, function (item) {
    return item * 2
  })

  same([2,4,6], output, "should create a new array with each element the result of the function passed to map")
  same([1,2,3], a, "should not mutate the original array")
})