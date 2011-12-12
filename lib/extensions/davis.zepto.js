/*!
 * Davis - zepto
 * Copyright (C) 2011 Oliver Nightingale
 * MIT Licensed
 */

/**
 * Davis.zepto allows Davis to be used with the Zepto (http://zepto.com) DOM library instead of the default jQuery.
 *
 *    this.extend(Davis.zepto)
 *
 * @plugin
 */
Davis.zepto = function () {
  Davis.$ = window.Zepto
  if (!Davis.$) throw('Zepto is not available, include Zepto before using this plugin.')
}