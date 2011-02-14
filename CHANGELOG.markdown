# Changelog

## 0.2.0

* Add `app.state` and `app.trans` to allow for routes that do not change the page url bar but are still navigable via the back and forward button.
* Add `request.whenStale` callback, called whenever a route becomes stale, i.e. when another route has been triggered by a new request.
* Fail more gracefully when `pushState` is not available [cmalvern](https://github.com/cmalven)
* Trigger 'unsupported' event when running in a browser that is unsupported