/*!
 * Davis - title
 * Copyright (C) 2011 Oliver Nightingale
 * MIT Licensed
 */

/**
 * Davis.title is a plugin that automatically sets the document title to the title associated with
 * a request.  If there is no title for a particular request then the title is not set, leaving the
 * title in place from the previous request.
 *
 * It also adds a helper method onto Davis.Request instances for manually setting the title.
 *
 * To include this plugin in your application first include a script tag for it and then in your
 * app do the following.
 *
 *    this.use(Davis.title)
 *
 * @plugin
 */
Davis.title = function () {

  /**
   * Bind to the apps runRoute event and set the document title to the requests title, if present
   * @private
   */
  this.bind('runRoute', function (req) {
    if (req.title) document.title = req.title
  });

  /**
   * Add a setTitle helper to requests
   * @private
   */
  this.helpers({

    /**
     * ## request.setTitle
     * Sets the current request and document title
     *
     * @param {String} the title for the document and this request
     *
     * ### Example
     *    req.setTitle('foo')
     */
    setTitle: function (title) {
      document.title = this.title = title;
    }
  })
}