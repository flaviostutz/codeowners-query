SHELL := /bin/bash
MISE := mise exec --
PACK := $(abspath ../lib/dist/codeowners-query-0.0.1.tgz)

.PHONY: all build install test clean

all: build test

build: install
	@echo '>>> examples: build'

install:
	@echo '>>> examples: install'
	# Install lib pack at examples root so node_modules/.bin/codeowners-query is available
	$(MISE) pnpm add codeowners-query@file:$(PACK)
	$(MISE) pnpm install

test:
	@echo '>>> examples: test'
	cd usage-basic && node index.js
	$(MAKE) -C usage-cli test

clean:
	@echo '>>> examples: clean'
	rm -rf node_modules
