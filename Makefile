
SRC = src/davis.js \
	src/davis.utils.js \
	src/davis.listener.js \
	src/davis.event.js \
	src/davis.logger.js \
	src/davis.route.js \
	src/davis.router.js \
	src/davis.history.js \
	src/davis.location.js \
	src/davis.request.js \
	src/davis.app.js

all: davis.js davis.min.js

davis.js: $(SRC)
	cat $^ > $@

davis.min.js: davis.js
	uglifyjs < $< > $@

docs:
	dox --title 'Davis' src/davis.*.js > docs/index.html
	dox --title 'Davis Plugins' src/plugins/davis.*.js > docs/plugins.html
	dox --title 'Davis Extensions' src/extensions/davis.*.js > docs/extensions.html

clean:
	rm -f davis{.min,}.js

test:
	@node server 3000

.PHONY: test clean docs