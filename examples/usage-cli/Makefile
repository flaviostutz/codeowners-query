SHELL := /bin/bash
CLI := $(abspath ../node_modules/.bin/codeowners-query)
CODEOWNERS_FILE := $(abspath CODEOWNERS)

.PHONY: test

test:
	@echo '>>> usage-cli: test'
	@echo '--- test 1: multiple files ---'
	@result=$$($(CLI) owners /shared/test.dat,/lib/package.dat --codeowners-file $(CODEOWNERS_FILE)); \
	expected=$$'@lib-team\n@shared-team'; \
	[ "$$result" = "$$expected" ] && echo "PASS: $$result" || (echo "FAIL: expected '$$expected', got '$$result'"; exit 1)
	@echo '--- test 2: single txt file ---'
	@result=$$($(CLI) owners /mytest.txt --codeowners-file $(CODEOWNERS_FILE)); \
	expected='@text-team'; \
	[ "$$result" = "$$expected" ] && echo "PASS: $$result" || (echo "FAIL: expected '$$expected', got '$$result'"; exit 1)
	@echo '--- test 3: directory pattern ---'
	@result=$$($(CLI) owners /shared/nothing.dat --codeowners-file $(CODEOWNERS_FILE)); \
	expected='@shared-team'; \
	[ "$$result" = "$$expected" ] && echo "PASS: $$result" || (echo "FAIL: expected '$$expected', got '$$result'"; exit 1)
	@echo '--- test 4: no match (empty output) ---'
	@result=$$($(CLI) owners /mytest.dat --codeowners-file $(CODEOWNERS_FILE) | tr -d '\n'); \
	[ -z "$$result" ] && echo "PASS: (empty)" || (echo "FAIL: expected empty, got '$$result'"; exit 1)
	@echo '--- test 5: non-existent file matched by pattern ---'
	@result=$$($(CLI) owners /inexistent.txt --codeowners-file $(CODEOWNERS_FILE)); \
	expected='@text-team'; \
	[ "$$result" = "$$expected" ] && echo "PASS: $$result" || (echo "FAIL: expected '$$expected', got '$$result'"; exit 1)
	@echo '--- test 6: --version flag ---'
	@$(CLI) --version
	@echo '--- test 7: three owners ---'
	@result=$$($(CLI) owners /docs/readme.md --codeowners-file $(CODEOWNERS_FILE)); \
	expected=$$'@content-team\n@doc-team\n@legal-team'; \
	[ "$$result" = "$$expected" ] && echo "PASS: $$result" || (echo "FAIL: expected '$$expected', got '$$result'"; exit 1)
	@echo '--- test 8: zero owners (no match) ---'
	@result=$$($(CLI) owners /unknown/file.bin --codeowners-file $(CODEOWNERS_FILE) | tr -d '\n'); \
	[ -z "$$result" ] && echo "PASS: (empty)" || (echo "FAIL: expected empty, got '$$result'"; exit 1)
	@echo '--- test 9: zero owners (explicit unowned entry) ---'
	@result=$$($(CLI) owners /generated/output.js --codeowners-file $(CODEOWNERS_FILE) | tr -d '\n'); \
	[ -z "$$result" ] && echo "PASS: (empty)" || (echo "FAIL: expected empty, got '$$result'"; exit 1)
	@echo '--- test 10: empty entry overrides parent owners ---'
	@result=$$($(CLI) owners /docs/_cache/build.js --codeowners-file $(CODEOWNERS_FILE) | tr -d '\n'); \
	[ -z "$$result" ] && echo "PASS: (empty)" || (echo "FAIL: expected empty, got '$$result'"; exit 1)
	@echo 'All CLI tests passed.'
