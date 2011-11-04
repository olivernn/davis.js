
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
	~/code/dox/bin/dox < davis.js | node docs/doc_builder.js > docs/index.html
	~/code/dox/bin/dox < davis.js > docs/index.json

clean:
	rm -f davis{.min,}.js

test:
	@node server 3000

.PHONY: test clean docs