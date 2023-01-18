'use strict';
const ENABLE_CODE_COVERAGE = !!process.env.ENABLE_CODE_COVERAGE;

module.exports = {
  setupFiles: ['<rootDir>/tests_config/run_spec.ts'],
  snapshotSerializers: ['jest-snapshot-serializer-raw'],
  testRegex: 'jsfmt\\.spec\\.(js|ts)$|tests/.*\\.(js|ts)$',
  collectCoverage: ENABLE_CODE_COVERAGE,
  testEnvironment: 'node',
  transform: {
    '^.+\\.(t|j)sx?$': 'ts-jest',
  },
  moduleFileExtensions: ['ts', 'js', 'json', 'node'],
};
