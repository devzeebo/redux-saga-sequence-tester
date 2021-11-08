const { pathsToModuleNameMapper } = require('ts-jest/utils');
const { compilerOptions } = require('./tsconfig.json');

module.exports = {
  testEnvironment: 'node',
  moduleNameMapper: pathsToModuleNameMapper(compilerOptions.paths, { prefix: '<rootDir>' }),
  clearMocks: true,
  roots: [
    './src',
    './examples',
  ],
  collectCoverageFrom: [
    './src/**/*.ts',
    '!./**/*.d.ts',
    '!./**/index.ts',
  ],
  coverageDirectory: './.build/coverage',
  transformIgnorePatterns: [
    '<rootDir>/node_modules/(?!@iherbscs)',
  ],
  slowTestThreshold: 10 * 1000,
};
