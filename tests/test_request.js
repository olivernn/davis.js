module("Request Module")

test("creating a request object from simple link", function () {

  var request;
  var e;

  var fixtureHolder = $('#qunit-fixture')

  var link = $('<a>', {
    'href': '/user'
  }).bind('click', function () {
    e = event;
    request = new Davis.Request(event);
    return false;
  })

  fixtureHolder.append(link);

  link.click();

  // equal(href, request.path, "path should be equal to the href of the link");
  equal('get', request.method, "link clicks should be get requests");
  equal(e, request.event, "request should contain the raw event that triggered the request");
  equal({}, request.params, "params should be empty object");

})