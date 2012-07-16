
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

VERSION = $(shell cat VERSION)

all: davis.js davis.min.js docs

davis.js: $(SRC)
	cat $^ | \
	sed "s/@VERSION/${VERSION}/" > $@

davis.min.js: davis.js
	uglifyjs < $< > $@

docs:
	dox < davis.js | dox-template -n Davis.js -r ${VERSION} > docs/index.html

clean:
	rm -f davis{.min,}.js

test:
	@node server 4000

.PHONY: test clean docs
