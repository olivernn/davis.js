Davis.googleAnalytics = function (asyncTracker) {
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
      if (asyncTracker && this.method == 'get') asyncTracker.push(['_trackPageview', this.path])
    }
  })
}