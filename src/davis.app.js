Davis.App = function () {
  Davis.History.onChange(function (rawEvent) {
    var route = Davis.Routes.lookup(rawEvent.path);
    var request = new Davis.Request(rawEvent);
    route.run(request);
  })
};

Davis.App.prototype = {
  
}