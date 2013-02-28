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
 * This module uses Davis.$, which by defualt is jQuery for its event binding and event object normalization.
 * To use Davis with any, or no, JavaScript framework be sure to provide support for all the methods called
 * on Davis.$.
 *
 * @module
 */
Davis.listener = function () {

  /*!
   * Methods to check whether an element has an href or action that is local to this page
   * @private
   */
  var originChecks = {
    A: function (elem) {
      return elem.host !== window.location.host || elem.protocol !== window.location.protocol
    },

    FORM: function (elem) {
      var a = document.createElement('a')
      a.href = elem.action
      return this.A(a)
    }
  }

  /*!
   * Checks whether the target of a click or submit event has an href or action that is local to the
   * current page.  Only links or targets with local hrefs or actions will be handled by davis, all
   * others will be ignored.
   * @private
   */
  var differentOrigin = function (elem) {
    if (!originChecks[elem.nodeName.toUpperCase()]) return true // the elem is neither a link or a form
    return originChecks[elem.nodeName.toUpperCase()](elem)
  }

  var hasModifier = function (event) {
    return (event.altKey || event.ctrlKey || event.metaKey || event.shiftKey)
  }

  /*!
   * A handler that creates a new Davis.Request and pushes it onto the history stack using Davis.history.
   * 
   * @param {Function} targetExtractor a function that will be called with the event target jQuery object and should return an object with path, title and method.
   * @private
   */
  var handler = function (targetExtractor) {
    return function (event) {
      if (hasModifier(event)) return true
      if (differentOrigin(this)) return true

      var request = new Davis.Request (targetExtractor.call(Davis.$(this)));
      Davis.location.assign(request)
      event.stopPropagation()
      event.preventDefault()
      return false;
    };
  };

  /*!
   * A handler specialized for click events.  Gets the request details from a link elem
   * @private
   */
  var clickHandler = handler(function () {
    var self = this

    return {
      method: 'get',
      fullPath: this.prop('href'),
      title: this.attr('title'),
      delegateToServer: function () {
        window.location = self.prop('href')
      }
    };
  });

  /*!
   * A handler specialized for submit events.  Gets the request details from a form elem
   * @private
   */
  var submitHandler = handler(function () {
    var self = this
    return {
      method: this.attr('method'),
      fullPath: (this.serialize() ? [this.prop('action'), this.serialize()].join("?") : this.prop('action')),
      title: this.attr('title'),
      delegateToServer: function () {
        self.submit()
      }
    };
  });

  /**
   * Binds to both link clicks and form submits using jQuery's deleagate.
   *
   * Will catch all current and future links and forms.  Uses the apps settings for the selector to use for links and forms
   * 
   * @see Davis.App.settings
   * @memberOf listener
   */
  this.listen = function () {
    Davis.$(document).delegate(this.settings.formSelector, 'submit', submitHandler)
    Davis.$(document).delegate(this.settings.linkSelector, 'click', clickHandler)
  }

  /**
   * Unbinds all click and submit handlers that were attatched with listen.
   *
   * Will efectivley stop the current app from processing any requests and all links and forms will have their default
   * behaviour restored.
   *
   * @see Davis.App.settings
   * @memberOf listener
   */
  this.unlisten = function () {
    Davis.$(document).undelegate(this.settings.linkSelector, 'click', clickHandler)
    Davis.$(document).undelegate(this.settings.formSelector, 'submit', submitHandler)
  }
}
