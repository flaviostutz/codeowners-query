import { owners, parseCodeowners } from './index';

describe('public API exports', () => {
  it('exports parseCodeowners function', () => {
    expect(typeof parseCodeowners).toBe('function');
  });

  it('exports owners function', () => {
    expect(typeof owners).toBe('function');
  });

  it('parseCodeowners and owners work end-to-end', () => {
    // *.txt is the last matching rule for /shared/readme.txt, so it wins
    const rules = parseCodeowners('/shared @shared-team\n*.txt @text-team');
    const result = owners(['/shared/readme.txt'], rules);
    expect(result).toEqual(['@text-team']);
  });
});
