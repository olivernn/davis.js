# Changelog

## 0.3.0

* Added `app.use` to use plugins in a Davis.App
* Added `app.helpers` to add helper methods to a Davis.Request object, available with a route callback.
* Created a Davis.title plugin, a simple plugin to set the page title for each request.
* Created a Davis.google_analytics plugin, a simple plugin to enable google analytics tracking of requests.
* Can now throw errors that happen in a route callback, this is disabled by default but can be enabled using `app.settings.throwErrors`.  When disabled an http request is made to the server.
* Add `routeError` event, triggered when an error occurs in a route callback.

## 0.2.1

* `request.whenStale` callback should receive the new request as a param and have this bound to the
new request.

## 0.2.0

* Add `app.state` and `app.trans` to allow for routes that do not change the page url bar but are still navigable via the back and forward button.
* Add `request.whenStale` callback, called whenever a route becomes stale, i.e. when another route has been triggered by a new request.
* Fail more gracefully when `pushState` is not available [cmalvern](https://github.com/cmalven)
* Trigger 'unsupported' event when running in a browser that is unsupported