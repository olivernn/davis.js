/*!
 * Davis - mixpanel
 * Copyright (C) 2011 Oliver Nightingale, Hannu Leinonen
 * MIT Licensed
 */

/**
 * Davis.mixpanel is a plugin to track Davis requests in Mixpanel.  It automatically
 * tracks every GET request and adds helpers to manually track other requests and to prevent a
 * particular request from being tracked.
 *
 * To include this plugin in your application first include a script tag for it. Find the Mixpanel
 * script and find the part containing.
 *    
 *    d=["init","track","track_links","track_forms","register","register_once","identify","name_tag","set_config"];
 *     
 * Modify the Mixpanel script by adding "track_pageview" to the list.
 * 
 *    d=["init","track","track_links","track_forms","track_pageview","register","register_once","identify","name_tag","set_config"];
 *                                                 ^   ADD THIS!   ^
 * 
 * Then in your app do the following.
 *
 *    this.use(Davis.mixpanel)
 *
 * @plugin
 */
Davis.mixpanel = function () {

  /**
   * whether a route should be tracked or not
   * @private
   */
  var shouldTrack = true

  /**
   * bind to the apps routeComplete event and track the request unless explicitly told not to.
   * @private
   */
  this.bind('routeComplete', function (req) {
    if (shouldTrack && req.method == 'get') req.track()
    shouldTrack = true
  })

  this.helpers({
    /**
     * ## request.noTrack
     * Disable tracking for this request
     */
    noTrack: function () {
      shouldTrack = false
    },

    /**
     * ## request.track
     * Track this request in mixpanel
     */
    track: function () {
      if (mpq) mpq.track_pageview()
    }
  })
}