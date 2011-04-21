# Changelog

## 0.4.0

* Only get requests should change the browser url, all others will create an entry in the history but not change the url
* By default any routes not handled by Davis will be automatically sent to the server.  This can be configured using the setting `handleRouteNotFound`
* Request methods and paths are now case insensitive
* Fixed bug which meant that restarting a Davis app would lead to events being bound to twice
* Work when jQuery is in no conflict mode

## 0.3.3

* Fixed [bug](https://github.com/olivernn/davis.js/issues#issue/2) when links contained other elements, reported by [kbingman](https://github.com/kbingman)

## 0.3.2

* Fixed bug which caused the initial page load to trigger two requests.
* Made the initial request for the page load configurable, by default it is on.

## 0.3.1

* fixed bug with `request.redirect` so that the browser url is set correctly.

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