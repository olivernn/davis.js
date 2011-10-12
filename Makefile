
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

clean:
	rm -f davis{.min,}.js

test:
	@node server 3000

.PHONY: test clean