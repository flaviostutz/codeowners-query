module.exports = {
  testEnvironment: 'node',
  testMatch: ['**/*.test.ts'],
  cacheDirectory: '<rootDir>/.cache/jest',
  coverageDirectory: '<rootDir>/.cache/coverage',
  collectCoverageFrom: ['src/**/*.ts', '!src/**/*.test.ts', '!src/adapters/**'],
  coverageThreshold: {
    global: {
      lines: 80,
      branches: 80,
    },
  },
  coverageProvider: 'v8',
  transform: {
    '^.+\\.tsx?$': [
      'ts-jest',
      {
        tsconfig: {
          module: 'commonjs',
        },
      },
    ],
  },
};
