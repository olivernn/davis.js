Davis.event = (function () {

  var callbacks = {}

  var bind = function (eventName, callback) {
    if (!callbacks[eventName]) callbacks[eventName] = [];
    callbacks[eventName].push(callback);
  }

  var trigger = function (eventName, data) {
    var self = this;
    if (!callbacks[eventName]) callbacks[eventName] = [];
    callbacks[eventName].forEach(function (callback) {
      callback.call(self, data);
    }) 
  }

  return {
    bind: bind,
    trigger: trigger
  }
})()