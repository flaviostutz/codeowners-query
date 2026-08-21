import path from 'node:path';
import { fileURLToPath } from 'node:url';
import baseConfig from '@stutzlab/eslint-config';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default [
  ...baseConfig,
  {
    files: ['src/**/*.ts'],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.json'],
        tsconfigRootDir: __dirname,
      },
    },
    rules: {
      // renamed to no-array-for-each in eslint-plugin-unicorn v56+
      'unicorn/no-for-each': 'off',
      'unicorn/no-array-for-each': 'error',
      // checkUsedVariables option removed in eslint-plugin-unicorn v56+
      'unicorn/prefer-export-from': ['error', { ignoreUsedVariables: false }],
    },
  },
];
