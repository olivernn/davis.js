Davis.title = function () {
  this.bind('runRoute', function (req) {
    if (req.title) document.title = req.title
  });

  this.helpers({
    setTitle: function (title) {
      document.title = this.title = title;
    }
  })
}