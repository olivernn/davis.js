/*!
 * Davis - listener
 * Copyright (C) 2011 Oliver Nightingale
 * MIT Licensed
 */

/**
 * A module to bind to link clicks and form submits and turn what would normally be http requests
 * into instances of Davis.Request.  These request objects are then pushed onto the history stack
 * using the Davis.history module.
 *
 * This module requires jQuery for its event binding and event object normalization.  To use Davis
 * with any, or no, JavaScript framework this module should be replaced with one using your framework
 * of choice.
 */
Davis.listener = (function () {

  /**
   * A handler that creates a new Davis.Request and pushes it onto the history stack using Davis.history.
   * 
   * @param {Function} targetExtractor a function that will be called with the event target jQuery object and should return an object with path, title and method.
   * @private
   */
  var handler = function (targetExtractor) {
    return function (event) {
      var request = new Davis.Request (targetExtractor.call(jQuery(this)));
      Davis.location.assign(request)
      return false;
    };
  };

  /**
   * A handler specialized for click events.  Gets the request details from a link elem
   * @private
   */
  var clickHandler = handler(function () {
    var self = this
    return {
      method: 'get',
      fullPath: this.attr('href'),
      title: this.attr('title'),
      delegateToServer: function () {
        window.location.pathname = self.attr('href')
      }
    };
  });

  /**
   * A handler specialized for submit events.  Gets the request details from a form elem
   * @private
   */
  var submitHandler = handler(function () {
    var extractFormParams = function (form) {
      return Davis.utils.map(form.serializeArray(), function (attr) {
        return [attr.name, attr.value].join('=')
      }).join('&')
    }

    var self = this

    return {
      method: this.attr('method'),
      fullPath: [this.attr('action'), extractFormParams(this)].join("?"),
      title: this.attr('title'),
      delegateToServer: function () {
        self.submit()
      }
    };
  });

  /**
   * ## app.listen
   * Binds to both link clicks and form submits using jQuery's deleagate.  Will catch all current
   * and future links and forms.  Uses the apps settings for the selector to use for links and forms
   * 
   * @see Davis.App.settings
   */
  var listen = function () {
    jQuery(document).delegate(this.settings.formSelector, 'submit', submitHandler)
    jQuery(document).delegate(this.settings.linkSelector, 'click', clickHandler)
  }

  /**
   * ## app.unlisten
   * Unbinds all click and submit handlers that were attatched with listen.  Will efectivley stop
   * the current app from processing any requests and all links and forms will have their default
   * behaviour restored.
   *
   * @see Davis.App.settings
   */
  var unlisten = function () {
    jQuery(document).undelegate(this.settings.linkSelector, 'click', clickHandler)
    jQuery(document).undelegate(this.settings.formSelector, 'submit', submitHandler)
  }

  /**
   * exposing the public methods of the module
   * @private
   */
  return {
    listen: listen,
    unlisten: unlisten
  }
})()