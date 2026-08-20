import { minimatch } from 'minimatch';

import type { Rule } from './parse-codeowners';

export function owners(filePaths: string[], rules: Rule[]): string[] {
  const ownerSet = new Set<string>();

  for (const filePath of filePaths) {
    // GitHub CODEOWNERS: last matching rule wins, overriding earlier matches
    let lastMatch: Rule | undefined;
    for (const rule of rules) {
      if (matchesPattern(filePath, rule.pattern)) {
        lastMatch = rule;
      }
    }
    if (lastMatch) {
      for (const owner of lastMatch.owners) {
        ownerSet.add(owner);
      }
    }
  }

  return Array.from(ownerSet).sort();
}

// Matches a file path against a single CODEOWNERS pattern using GitHub semantics.
function matchesPattern(filePath: string, pattern: string): boolean {
  const normalizedPath = filePath.startsWith('/') ? filePath.slice(1) : filePath;
  const opts = { dot: true };

  if (!pattern.includes('/')) {
    // Bare pattern (e.g. *.txt) — match basename at any depth
    return minimatch(normalizedPath, pattern, { ...opts, matchBase: true });
  }

  // Strip leading / for root-anchored patterns
  let p = pattern.startsWith('/') ? pattern.slice(1) : pattern;

  // Trailing / means explicit directory match
  if (p.endsWith('/')) {
    return minimatch(normalizedPath, `${p}**`, opts);
  }

  if (minimatch(normalizedPath, p, opts)) return true;

  // No wildcards — also test as recursive directory prefix (e.g. /shared → shared/**)
  if (!p.includes('*') && !p.includes('?') && !p.includes('[')) {
    return minimatch(normalizedPath, `${p}/**`, opts);
  }

  return false;
}
