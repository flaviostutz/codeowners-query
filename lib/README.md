# codeowners-query

Query owners involved given a list of file paths based on a CODEOWNERS file configuration.

## Quick Start

```bash
pnpm add codeowners-query
```

```typescript
import { owners, parseCodeowners } from 'codeowners-query';
import * as fs from 'node:fs';

const rules = parseCodeowners(fs.readFileSync('CODEOWNERS', 'utf-8'));
const result = owners(['/src/main.ts'], rules);
console.log(result); // e.g. ['@backend-team']
```

Given a `CODEOWNERS` file in the current directory, resolve which teams or users own one or more files. Supports all standard GitHub CODEOWNERS pattern syntax.

## Installation

```bash
npm install -g codeowners-query
# or run directly with npx
npx codeowners-query --help
```

## CLI usage

The `CODEOWNERS` file is read from the current working directory by default.

### Example CODEOWNERS file

```
/shared  @shared-team
/lib     @lib-team
*.txt    @text-team
```

### Example 1: multiple files

```bash
cd repo1
npx codeowners-query owners /shared/test.txt,/lib/package.txt
# @lib-team
# @shared-team
# @text-team
```

### Example 2: single file matching an extension pattern

```bash
cd repo1
npx codeowners-query owners /mytest.txt
# @text-team
```

### Example 3: file matching a directory pattern

```bash
cd repo1
npx codeowners-query owners /shared/nothing.dat
# @shared-team
```

### Example 4: no matching rule — empty output

```bash
cd repo1
npx codeowners-query owners /mytest.dat
# (empty line)
```

### Example 5: custom CODEOWNERS file location

```bash
npx codeowners-query owners /src/main.ts --codeowners-file /path/to/CODEOWNERS
```

### Verbose output

```bash
npx codeowners-query owners /src/main.ts --verbose
```

## API usage

```typescript
import { owners, parseCodeowners } from 'codeowners-query';
import * as fs from 'node:fs';

const text = fs.readFileSync('CODEOWNERS', 'utf-8');
const rules = parseCodeowners(text);

// Get owners for a single file
const result = owners(['/shared/test.txt'], rules);
console.log(result); // ['@shared-team', '@text-team']
```

```typescript
import { owners, parseCodeowners, type Rule } from 'codeowners-query';

// Build rules manually
const rules: Rule[] = [
  { pattern: '/shared', owners: ['@shared-team'] },
  { pattern: '*.txt', owners: ['@text-team'] },
];

// Query multiple files — owners are globally deduplicated and sorted
const result = owners(['/shared/test.txt', '/lib/package.txt'], rules);
console.log(result); // ['@shared-team', '@text-team']
```

## Behaviour

- **Paths**: both absolute (`/shared/test.txt`) and relative (`shared/test.txt`) are accepted.
- **Output order**: owners are printed alphabetically, one per line.
- **Deduplication**: owners are globally deduplicated across all input files and all matching rules.
- **Empty output**: a single newline is printed when no rule matches; exit code is `0`.
- **Missing CODEOWNERS**: exits with code `1` and an error on stderr.
- **Pattern semantics**: follows GitHub CODEOWNERS rules — a pattern with no `/` matches at any depth; `/dir` matches all files recursively under `dir/`.

## Development

```bash
make build
make lint
make test
```

See the sibling `examples/` folder for complete runnable examples that consume the packed artifact from `lib/dist/`.

## License

MIT

