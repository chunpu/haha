REPORTER = spec


test: test-unit

test-unit:  
	@NODE_ENV=test ./node_modules/mocha/bin/mocha \
    --reporter $(REPORTER) \
