SHELL := /bin/bash
.DEFAULT_GOAL := all

.PHONY: setup all build build-module lint lint-fix test test-watch clean install publish

setup:
	@echo '>>> root: setup'
	mise install

all build build-module lint lint-fix test test-watch clean install:
	@echo ''
	@echo '>>> Running /lib:$@...'
	@$(MAKE) -C lib $@
	@echo ''
	@echo '>>> Running /examples:$@...'
	@$(MAKE) -C examples $@

publish:
	@echo ''
	@echo '>>> Running /lib:publish...'
	@$(MAKE) -C lib publish
