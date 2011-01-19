// Davis.event = (function () {
// 
//   var callbacks = {}
// 
//   var bind = function (eventName, callback) {
//     if (!callbacks[eventName]) callbacks[eventName] = [];
//     callbacks[eventName].push(callback);
//     return this;
//   }
// 
//   var trigger = function (eventName, data) {
//     var self = this;
//     if (!callbacks[eventName]) callbacks[eventName] = [];
//     callbacks[eventName].forEach(function (callback) {
//       callback.call(self, data);
//     }) 
//     return this;
//   }
// 
//   return {
//   
//     bind: bind,
//     trigger: trigger
//   }
// })()

Davis.event = {
  _callbacks: {},

  bind: function (eventName, callback) {
    if (!this._callbacks[eventName]) this._callbacks[eventName] = [];
    this._callbacks[eventName].push(callback);
    return this;
  },

  trigger: function (eventName, data) {
    var self = this;
    if (!this._callbacks[eventName]) this._callbacks[eventName] = [];
    this._callbacks[eventName].forEach(function (callback) {
      callback.call(self, data);
    }) 
    return this;
  }
}