/*!
 * Davis - Request
 * Copyright (C) 2011 Oliver Nightingale
 * MIT Licensed
 */

/**
 * Daivs.Requests are created from click and submit events.  Davis.Requests are passed to Davis.Routes
 * and are stored in the history stack.  They are instantiated by the Davis.listener module.
 *
 * A request will have a params object which will contain all query params and form params, any named
 * params in a routes path will also be added to the requests params object.  Also included is support
 * for rails style nested form params.
 *
 * By default the request method will be taken from the method attribute for forms or will be defaulted
 * to 'get' for links, however there is support for using a hidden field called _method in your forms
 * to set the correct reqeust method.
 *
 * @constructor
 * @param {Object} raw An object that at least contains a title, fullPath and method proprty.
 *
 * ### Example:
 *     var request = new Davis.Request({
 *       title: "foo",
 *       fullPath: "/foo/12",
 *       method: "get"
 *     })
 */
Davis.Request = function (raw) {
  var self = this;
  this.raw = raw;
  this.params = {};
  this.title = raw.title;
  this.queryString = raw.fullPath.split("?")[1];
  this._staleCallback = function () {};

  if (this.queryString) {
    Davis.utils.forEach(this.queryString.split("&"), function (keyval) {
      var paramName = keyval.split("=")[0],
          paramValue = keyval.split("=")[1],
          nestedParamRegex = /^(\w+)\[(\w+)\]/,
          nested;

      if (nested = nestedParamRegex.exec(paramName)) {
        var paramParent = nested[1];
        var paramName = nested[2];
        var parentParams = self.params[paramParent] || {};
        parentParams[paramName] = paramValue;
        self.params[paramParent] = parentParams;
      } else {
        self.params[paramName] = paramValue;
      };

    });
  };

  this.method = (this.params._method || raw.method).toLowerCase();
  this.path = raw.fullPath.replace(/\?.+$/, "");
  this.delegateToServer = raw.delegateToServer || Davis.noop;
  this.isForPageLoad = raw.forPageLoad || false;

  if (Davis.Request.prev) Davis.Request.prev.makeStale(this);
  Davis.Request.prev = this;

};

/**
 * ## request.redirect
 * Redirects the current request to a new location.  Calling redirect on an instance of
 * Davis.Request will create a new request using the path and title of the current request.
 * Redirected requests always have a method of 'get'
 *
 * The request created will replace the current request in the history stack.  Redirect is most
 * often useful inside a handler for a form submit.  After succesfully handling the form the app
 * can redirect to another path.  This means that the current form will not be re-submitted if
 * navigating through the history with the back or forward buttons because the request that the
 * submit generated has been replaced in the history stack.
 *
 * @param {String} path The path to redirect the current request to
 *
 * ### Example:
 *     this.post('/foo', function (req) {
 *       processFormRequest(req.params)  // do something with the form request
 *       req.redirect('/bar');
 *     })
 */
Davis.Request.prototype.redirect = function (path) {
  Davis.location.replace(new Davis.Request ({
    method: 'get',
    fullPath: path,
    title: this.title
  }));
};

/**
 * ## request.whenStale
 * Adds a callback to be called when the request is stale.  A request becomes stale when it is no
 * longer the current request, this normally occurs when a new request is triggered.  A request 
 * can be marked as stale manually if required.  The callback passed to whenStale will be called
 * with the new request that is making the current request stale.
 *
 * Use the whenStale callback to 'teardown' the objects required for the current route, this gives
 * a chance for views to hide themselves and unbind any event handlers etc.
 *
 * @param {Function} callback A single callback that will be called when the request becomes stale.
 *
 * ### Example:
 *     this.get('/foo', function (req) {
 *       var fooView = new FooView ()
 *       fooView.render() // display the foo view
 *       req.whenStale(function (nextReq) {
 *         fooView.remove() // stop displaying foo view and unbind any events
 *       })
 *     })
 *
 */
Davis.Request.prototype.whenStale = function (callback) {
  this._staleCallback = callback;
}

/**
 * ## request.makeStale
 * Mark the request as stale.  This will cause the whenStale callback to be called.
 *
 * @param {Davis.Request} req The next request that has been recieved.
 */
Davis.Request.prototype.makeStale = function (req) {
  this._staleCallback.call(req, req);
}

/**
 * ## request.location
 * Returns the location or path that should be pushed onto the history stack, for get requests this
 * will be the same as the path, for post, put, delete and state requests this will be blank as no
 * location should be pushed onto the history stack.
 *
 * @returns {String} string The location that the url bar should display and should be pushed onto the history stack for this request.
 */
Davis.Request.prototype.location = function () {
  return (this.method === 'get') ? this.path : ''
}

/**
 * ## request.toString
 * Converts the request to a string representation of itself by combining the method and path
 * attributes.
 *
 * @returns {String} string representation of the request
 */
Davis.Request.prototype.toString = function () {
  return [this.method.toUpperCase(), this.path].join(" ")
};

/**
 * ## request.asJSON
 * Converts the request to a plain object which can be converted to a JSON string.  Used when
 * pushing a request onto the history stack.
 *
 * @returns {Object} a plain object representation of the request.
 */
Davis.Request.prototype.asJSON = function () {
  return {
    title: this.raw.title,
    fullPath: this.raw.fullPath,
    method: this.raw.method
  }
}

/**
 * ## Davis.Request.forPageLoad
 * Creates a new request for the page on page load.
 * This is required because usually requests are generated from clicking links or submitting forms
 * however this doesn't happen on a page load but should still be considered a request that the 
 * JavaScript app should handle.
 *
 * @returns {Davis.Request} A request representing the current page loading.
 */
Davis.Request.forPageLoad = function () {
  return new this ({
    method: 'get',
    // fullPath: window.location.pathname,
    fullPath: Davis.location.current(),
    title: document.title,
    forPageLoad: true
  });
}

/**
 * ## Davis.Request.prev
 * Stores the last request
 * @private
 */
Davis.Request.prev = null