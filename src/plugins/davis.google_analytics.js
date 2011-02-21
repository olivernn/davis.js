Davis.googleAnalytics = function () {
  var shouldTrack = true

  this.bind('routeComplete', function (req) {
    if (shouldTrack) req.track()
    shouldTrack = true
  })

  this.helpers({
    noTrack: function () {
      shouldTrack = false
    },

    track: function () {
      if (_gaq && this.method == 'get') _gaq.push(['_trackPageview', this.path])
    }
  })
}