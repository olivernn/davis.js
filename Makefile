
SRC = lib/davis.js \
	lib/davis.utils.js \
	lib/davis.listener.js \
	lib/davis.event.js \
	lib/davis.logger.js \
	lib/davis.route.js \
	lib/davis.router.js \
	lib/davis.history.js \
	lib/davis.location.js \
	lib/davis.request.js \
	lib/davis.app.js

all: davis.js davis.min.js

davis.js: $(SRC)
	cat $^ > $@

davis.min.js: davis.js
	uglifyjs < $< > $@

docs:
	dox --title 'Davis' lib/davis.*.js > docs/index.html
	dox --title 'Davis Plugins' lib/plugins/davis.*.js > docs/plugins.html
	dox --title 'Davis Extensions' lib/extensions/davis.*.js > docs/extensions.html

clean:
	rm -f davis{.min,}.js

test:
	@node server 3000

.PHONY: test clean docs