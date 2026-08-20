import { owners } from './owners';
import type { Rule } from './parse-codeowners';

const SPEC_RULES: Rule[] = [
  { pattern: '/shared', owners: ['@shared-team'] },
  { pattern: '/lib', owners: ['@lib-team'] },
  { pattern: '*.txt', owners: ['@text-team'] },
];

describe('owners', () => {
  // Example 1: multiple files each matched by their last rule
  it('returns sorted unique owners for multiple comma-split files', () => {
    // /shared/test.txt: last match is *.txt → @text-team
    // /lib/package.dat: last match is /lib → @lib-team (*.txt doesn't match .dat)
    const result = owners(['/shared/test.txt', '/lib/package.dat'], SPEC_RULES);
    expect(result).toEqual(['@lib-team', '@text-team']);
  });

  // Example 2: single txt file at root
  it('returns text-team for a txt file at root', () => {
    expect(owners(['/mytest.txt'], SPEC_RULES)).toEqual(['@text-team']);
  });

  // Example 3: directory match with non-txt extension
  it('returns shared-team for a .dat file under /shared', () => {
    expect(owners(['/shared/nothing.dat'], SPEC_RULES)).toEqual(['@shared-team']);
  });

  // Example 4: non-existent file — still matched by pattern
  it('returns owners for a non-existent path that matches a pattern', () => {
    expect(owners(['/inexistent.txt'], SPEC_RULES)).toEqual(['@text-team']);
  });

  // Example 5: no rule matches
  it('returns empty array when no rule matches', () => {
    expect(owners(['/mytest.dat'], SPEC_RULES)).toEqual([]);
  });

  it('accepts relative paths and normalizes them to match root-anchored patterns', () => {
    // .dat files only match /shared or /lib (not *.txt), so last match is the dir rule
    expect(owners(['shared/nothing.dat'], SPEC_RULES)).toEqual(['@shared-team']);
    expect(owners(['lib/package.dat'], SPEC_RULES)).toEqual(['@lib-team']);
  });

  it('deduplicates owners globally across files and rules', () => {
    // Both files last-match *.txt @text-team; deduplicated to one entry
    const result = owners(['/shared/test.txt', '/mytest.txt'], SPEC_RULES);
    expect(result).toEqual(['@text-team']);
  });

  it('matches * wildcard against any file at any depth', () => {
    const rules: Rule[] = [{ pattern: '*', owners: ['@global-owner'] }];
    expect(owners(['/any/path/file.js'], rules)).toEqual(['@global-owner']);
    expect(owners(['/root-file.ts'], rules)).toEqual(['@global-owner']);
  });

  it('matches **/* pattern against any file', () => {
    const rules: Rule[] = [{ pattern: '**/*', owners: ['@everyone'] }];
    expect(owners(['/deep/nested/file.ts'], rules)).toEqual(['@everyone']);
  });

  it('matches trailing-slash directory pattern', () => {
    const rules: Rule[] = [{ pattern: '/docs/', owners: ['@docs-team'] }];
    expect(owners(['/docs/readme.md'], rules)).toEqual(['@docs-team']);
    expect(owners(['/other/readme.md'], rules)).toEqual([]);
  });

  it('returns empty array when rules list is empty', () => {
    expect(owners(['/some/file.txt'], [])).toEqual([]);
  });

  it('empty-owner rule overrides earlier matching parent rule', () => {
    const rules: Rule[] = [
      { pattern: '/docs', owners: ['@doc-team'] },
      { pattern: '/docs/_cache', owners: [] },
    ];
    expect(owners(['/docs/readme.md'], rules)).toEqual(['@doc-team']);
    expect(owners(['/docs/_cache/build.js'], rules)).toEqual([]);
  });

  it('returns empty array when file paths list is empty', () => {
    expect(owners([], SPEC_RULES)).toEqual([]);
  });

  it('returns owners sorted alphabetically', () => {
    const rules: Rule[] = [{ pattern: '*.ts', owners: ['@z-team', '@a-team', '@m-team'] }];
    expect(owners(['/file.ts'], rules)).toEqual(['@a-team', '@m-team', '@z-team']);
  });
});
