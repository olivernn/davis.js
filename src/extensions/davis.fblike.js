/*!
 * Davis - fblike
 * Copyright (C) 2011 Hannu Leinonen
 * MIT Licensed
 */

/**
 * Davis.fblike is an extension to Davis that will update the Facebook like 
 * button's target to the current page the user is viewing or a predefined path.
 * 
 * To use this extension put code similar to one of these examples before 
 * starting your app.
 * 
 *     Davis.extend(Davis.fblike)
 *     Davis.extend(Davis.fblike("/foo/bar"))
 *     Davis.extend(Davis.fblike("http://example.com/foo/bar"))
 * 
 * @plugin
 */
Davis.fblike = function(path) {
	path = path ? path.match(/^https?:\/\/.+/) === null ? 
			window.location.protocol + "//" + window.location.host + path : path : null;
	
	return function(Davis) {
		Davis.event.bind('routeComplete', function(req) {
			if (req.method == 'get' && path)
				$('div.fb-like').attr('data-href', path);
		});
	};
}