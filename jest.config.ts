import type { Config } from 'jest';

const config: Config = {
  transform: {
    '^.+\\.tsx?$': ['ts-jest', {}]
  },
  collectCoverage: true,

  coverageDirectory: 'coverage',

  coverageProvider: 'v8',

  preset: 'ts-jest'
};

export default config;
