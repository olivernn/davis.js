# Changelog

## 0.9.8

* Fix an issue that prevented params with new lines from being handled properly the hash routing plugin, thanks [maxthelion](https://github.com/maxthelion)
* Fix an issue with the way params are encoded and decoded [issue 70](https://github.com/olivernn/davis.js/issues/70), thanks [Valloric](https://github.com/Valloric)

## 0.9.7

* Pass request options through the location delegate to the location handling object.
* Pass request options through the request redirect method.
* Add a simpler hash routing plugin.

## 0.9.6

* Proper handling of relative paths using $.prop instead of $.attr [issue 58](https://github.com/olivernn/davis.js/issues/58)
* Remove redundent redeclaration inside utils.toArray [issue 60](https://github.com/olivernn/davis.js/pull/60)

## 0.9.5

* Stop trapping click events with modifier keys [issue 40](https://github.com/olivernn/davis.js/pull/40), thanks [manuel-woelker](https://github.com/manuel-woelker) and [Valloric](https://github.com/Valloric)

## 0.9.4

* Router scopes should apply to before and after filters [issue 54](https://github.com/olivernn/davis.js/issues/54)
* Scopes shouldn't be applied to routes defined with RegExp paths.

## 0.9.3

* More fixes for initial popstate bug [issue 52](https://github.com/olivernn/davis.js/issues/52)
* Fix issue with noIOS extension [issue 51](https://github.com/olivernn/davis.js/issues/51)
* Fix issue when delegating to server with query params [issue 43](https://github.com/olivernn/davis.js/issues/43)
* Add a timestamp to request objects.

## 0.9.2

* Fix initial popstate bug

## 0.9.1

* Fix bug with using route level middleware with routing shortcut methods.
* Fix bug with decoding url encoded parameters [issue 39](https://github.com/olivernn/davis.js/issues/39)

## 0.9.0

* Add support for scoped definition of routes using `scope`.
* Add support for route level middleware.
* Add support for splat params in route definition.
* Davis.location now accepts an options param, allowing to assign/replace routes silently.
* Changed the signature for creating Davis.Routes, can now just pass a string as the path.
* Closer adherence to the same origin policy when binding to links and forms.
* Fix bug where params in the request object were still URI encoded.
* Explicitly prevent default when binding to links and forms, allows better integration with ender.

## 0.8.1

* Fix issue with Davis.listener fixes [issue 32](https://github.com/olivernn/davis.js/issues/32)
* Move davis.fblike and davis.mixpanel into the correct directory

## 0.8.0

* Davis is no longer dependent on jQuery, can be used with any or no DOM library with the use of extensions.
* Added Zepto extension to allow Davis to be used with Zepto.
* More robust checking of link origins, protocols must match to be caught by Davis, thanks [jacobcoens](http://github.com/jacobcoens)
* Added Mixpanel plugin, thanks [hleinone](https://github.com/hleinone)
* Added Facebook Like plugin, thanks [hleinone](https://github.com/hleinone)
* Fixed several bugs with the hashRouting extension.

## 0.7.0

* Refactor of internals, many components now implemented as Davis plugins, making it easier to extend the library.
* Simplify build tools, removed dependencies on ruby and java.  Now all you need is make and node.js.  Thanks [visionmedia](http://github.com/visionmedia).
* The `Davis` convenience function no longer requires a config function to be passed in when creating an app.  [visionmedia](http://github.com/visionmedia)
* The `Davis` convenience function auto starts the app as soon as possible. [visionmedia](http://github.com/visionmedia).
* Changed default setting `generateRequestOnPageLoad`, now it is false by default.
* `Davis.logger` is now implemented as a plugin not a setting.
* Renamed `Davis.Request.prototype.asJSON` to `Davis.Request.prototype.toJSON`. [visionmedia](http://github.com/visionmedia).
* Fix browser inconsistency bug where Firefox would not fire a popstate event on page load.

## 0.6.2

* Fix [issue](https://github.com/olivernn/davis.js/pull/16) so that a requests' location includes any query params.  Fixed by [hleinone](https://github.com/hleinone).

## 0.6.1

* Normalise node name when checking link and form origins, fixes [bug](https://github.com/olivernn/davis.js/pull/12) when used in xhtml documents.  Reported by [sabberworm](https://github.com/sabberworm).
* Fix [issue](https://github.com/olivernn/davis.js/issues/14) when submitting forms with only file inputs or with no inputs.  Reported by [hleinone](https://github.com/hleinone).

## 0.6.0

* Ignore any links or forms that are not on the same origin, only listen to clicks on links and forms with a href or action from the same domain.
* Big upgrade to the hashRouting extension, adding fallback for browsers that don't support `onhashchange` & the ability to fallback to hash based routing in browsers that do not support pushState.  Many thanks to [jbaudanza](https://github.com/jbaudanza).
* Fix [bug](https://github.com/olivernn/davis.js/pull/6) in Davis.Request so that full urls are handled properly, [jbaudanza](https://github.com/jbaudanza).
* Fix [bug](https://github.com/olivernn/davis.js/pull/8) when parsing rails style nested params with arrays, thanks [ismasan](https://github.com/ismasan).
* Creating instances of Davis.Request should be more robust, fixes issues seen in some versions of Chrome.
* State data is pushed into the history state object under a `_davis` prefix to defend against any possible clashes with other code manipulating the history.
* Add extension to disable Davis support in iOS versions less than 5.

## 0.5.1

* Fixes required for Opera support now that Opera 11.50 supports pushState.
* Ensure that jQuery is never referenced as $.

## 0.5.0

* Introduce Davis.location object which acts as an interface to any kind of routing mechanism.  Expects to be passed a delegate object which will do the actual routing work.  By default the delegate is the HTML5 pushState module Davis.history.
* Renamed methods on Davis.history to match the interface set out by Davis.location.  `Davis.history.pushState` becomes `Davis.history.assign` & `Davis.history.replaceState` becomes `Davis.history.replace`.
* Added `Davis.extend` method for adding library level extensions.
* Added Davis.hashRouting extension allowing use of location.hash based routing.
* Changed `Davis.App.prototype.configure` so that the settings object is yielded as the first argument to the config function.

## 0.4.3

* Merge [pull request](https://github.com/olivernn/davis.js/pull/4) fixes issues with IE's console functions/objects and IE's handling of lastIndex, thanks to [jbaudanza](https://github.com/jbaudanza).

## 0.4.2

* Fixed [bug](https://github.com/olivernn/davis.js/issues#issue/3) by introducing a utils module which uses native implementations of `Array.prototype.every`, `Array.prototype.forEach`, `Array.prototype.filter`, `Array.prototype.map` if they exist and if not falls back to a non native implementation.  This allows Davis.js to fail gracefully in IE.  Thanks to to [jbaudanza](https://github.com/jbaudanza) for reporting the issue.

## 0.4.1

* If no route is found for the initial page load request don't stop the app
* Log a message when the app is stopped

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
