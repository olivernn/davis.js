Davis.Message = function (name, data) {
  this.display = name;
  this.name = name.split('.')[0]
  this.namespace = name.split('.')[1] || 'global'
  this.data = data
  this.type = 'message'
}

Davis.Message.prototype.toString = function () {
  return ["MESSAGE", this.display].join(' ')
}