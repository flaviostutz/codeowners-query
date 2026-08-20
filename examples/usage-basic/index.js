import { owners, parseCodeowners } from 'codeowners-query';

const codeownersText = `
/shared  @shared-team
/lib     @lib-team
*.txt    @text-team
`;

const rules = parseCodeowners(codeownersText);

// Example 1: multiple files — each uses its last matching rule
const result1 = owners(['/shared/test.dat', '/lib/package.dat'], rules);
console.log('owners of /shared/test.dat,/lib/package.dat:', result1);
// expected: ['@lib-team', '@shared-team']

// Example 2: no matching rule
const result2 = owners(['/mytest.dat'], rules);
console.log('owners of /mytest.dat:', result2);
// expected: []

// Example 3: relative path
const result3 = owners(['shared/nothing.dat'], rules);
console.log('owners of shared/nothing.dat:', result3);
// expected: ['@shared-team']
