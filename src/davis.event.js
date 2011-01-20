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
};

