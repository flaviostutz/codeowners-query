import { parseCodeowners } from './parse-codeowners';

describe('parseCodeowners', () => {
  it('parses rules with single owner', () => {
    const text = `/shared @shared-team\n/lib @lib-team\n*.txt @text-team`;
    const rules = parseCodeowners(text);
    expect(rules).toHaveLength(3);
    expect(rules[0]).toEqual({ pattern: '/shared', owners: ['@shared-team'] });
    expect(rules[1]).toEqual({ pattern: '/lib', owners: ['@lib-team'] });
    expect(rules[2]).toEqual({ pattern: '*.txt', owners: ['@text-team'] });
  });

  it('parses multiple owners on one line', () => {
    const text = `/shared @team1 @team2 @user`;
    const rules = parseCodeowners(text);
    expect(rules[0].owners).toEqual(['@team1', '@team2', '@user']);
  });

  it('skips comment lines', () => {
    const text = `# This is a comment\n/shared @shared-team`;
    const rules = parseCodeowners(text);
    expect(rules).toHaveLength(1);
    expect(rules[0].pattern).toBe('/shared');
  });

  it('skips blank lines', () => {
    const text = `\n/shared @shared-team\n\n/lib @lib-team`;
    const rules = parseCodeowners(text);
    expect(rules).toHaveLength(2);
  });

  it('includes unowned rules with an empty owners array', () => {
    const text = `/shared`;
    const rules = parseCodeowners(text);
    expect(rules).toHaveLength(1);
    expect(rules[0]).toEqual({ pattern: '/shared', owners: [] });
  });

  it('returns empty array for a comments-only file', () => {
    const text = `# Owner: team\n# This file intentionally left empty`;
    const rules = parseCodeowners(text);
    expect(rules).toHaveLength(0);
  });

  it('returns empty array for empty input', () => {
    expect(parseCodeowners('')).toHaveLength(0);
    expect(parseCodeowners('   ')).toHaveLength(0);
  });
});
