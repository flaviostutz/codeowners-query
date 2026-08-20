SHELL := /bin/bash
MISE := mise exec --
CACHE_DIR := .cache
.DEFAULT_GOAL := all

.PHONY: all build build-module lint lint-fix test test-watch clean install publish

all: build lint test

build: install
	@echo '>>> lib: build'
	@rm -rf dist
	@mkdir -p dist
	@mkdir -p $(CACHE_DIR)/tsc
	$(MISE) pnpm exec tsc --outDir dist
	@-find ./dist \( -regex '.*\.test\..*' -o -regex '.*__tests.*' \) -exec rm -rf {} \; 2> /dev/null
	@VERSION=$$($(MISE) node -p "require('./package.json').version"); \
	$(MISE) pnpm exec esbuild src/adapters/cli/index.ts \
		--bundle \
		--platform=node \
		--outfile=dist/cli.js \
		--define:PKG_VERSION=\"$$VERSION\" \
		--banner:js="#!/usr/bin/env node"
	@chmod +x dist/cli.js
	$(MISE) pnpm pack --pack-destination dist

build-module: install
	@echo '>>> lib: build-module'
	@rm -rf dist
	@mkdir -p dist
	@mkdir -p $(CACHE_DIR)/tsc
	$(MISE) pnpm exec tsc --outDir dist
	@-find ./dist \( -regex '.*\.test\..*' -o -regex '.*__tests.*' \) -exec rm -rf {} \; 2> /dev/null

lint:
	@echo '>>> lib: lint'
	@mkdir -p $(CACHE_DIR)/eslint
	$(MISE) pnpm exec eslint ./src --cache --cache-location $(CACHE_DIR)/eslint/.eslintcache

lint-fix:
	@echo '>>> lib: lint-fix'
	@mkdir -p $(CACHE_DIR)/eslint
	$(MISE) pnpm exec eslint ./src --fix --cache --cache-location $(CACHE_DIR)/eslint/.eslintcache

test:
	@echo '>>> lib: test'
	$(MISE) pnpm exec jest --verbose --coverage

test-watch:
	$(MISE) pnpm exec jest --watch

clean:
	@echo '>>> lib: clean'
	rm -rf node_modules
	rm -rf dist
	rm -rf .cache

install:
	@echo '>>> lib: install'
	mise install
	$(MISE) pnpm install --frozen-lockfile --config.dedupe-peer-dependents=false

publish:
	@echo '>>> lib: publish'
	$(MISE) npx -y monotag@1.26.0 current --bump-action=latest --prefix=
	@VERSION=$$($(MISE) node -p "require('./package.json').version"); \
	if echo "$$VERSION" | grep -q '-'; then \
		TAG=$$(echo "$$VERSION" | sed 's/[0-9]*\.[0-9]*\.[0-9]*-\([a-zA-Z][a-zA-Z0-9]*\).*/\1/'); \
		echo "Prerelease version $$VERSION detected, publishing with --tag $$TAG"; \
		$(MISE) npm publish --no-git-checks --provenance --access public --tag "$$TAG"; \
	else \
		$(MISE) npm publish --no-git-checks --provenance --access public; \
	fi
