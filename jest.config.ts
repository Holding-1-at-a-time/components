import type { Config } from "jest";
import nextJest from "next/jest.js";

const createJestConfig = (nextConfig: Config): Config => {
  return {
    ...nextConfig,

    // The directory where Jest should store its cached dependency information
    cacheDirectory: "C:/Users/rrome/node_modules/.cache/jest",

    // Automatically clear mock calls, instances, contexts and results before every test
    clearMocks: true,

    // Indicates whether the coverage information should be collected while executing the test
    collectCoverage: true,

    // An array of glob patterns indicating a set of files for which coverage information should be collected
    collectCoverageFrom: ["./**/*.{js,jsx,ts,tsx}"],

    // The directory where Jest should output its coverage files
    coverageDirectory: "C:/Users/rrome/components/coverage",

    // Indicates which provider should be used to instrument code for coverage
    coverageProvider: "babel",

    // Make calling deprecated APIs throw helpful error messages
    errorOnDeprecated: true,

    // The maximum amount of workers used to run your tests. Can be specified as % or a number. E.g. maxWorkers: 10% will use 10% of your CPU amount + 1 as the maximum worker number. maxWorkers: 2 will use a maximum of 2 workers.
    maxWorkers: "90%",

    // An array of directory names to be searched recursively up from the requiring module's location
    moduleDirectories: ["node_modules"],

    // An array of file extensions your modules use
    moduleFileExtensions: [
      "js",
      "mjs",
      "cjs",
      "jsx",
      "ts",
      "tsx",
      "json",
      "node",
    ],

    // Automatically restore mock state and implementation before every test
    restoreMocks: false,

    // The root directory that Jest should scan for tests and modules within
    rootDir: "C:/Users/rrome/components",

    // A list of paths to directories that Jest should use to search for files in
    // roots: ["<rootDir>"],

    // Allows you to use a custom runner instead of Jest's default test runner
    runner: "jest-runner",

    // The test environment that will be used for testing
    testEnvironment: "jsdom",

    // The glob patterns Jest uses to detect test files
    testMatch: [
      "**/__tests__/**/*.[jt]s?(x)",
      "**/?(*.)+(spec|test).[tj]s?(x)",
    ],

    // An array of regexp pattern strings that are matched against all test paths, matched tests are skipped
    testPathIgnorePatterns: [
      "\\\\node_modules\\\\",
    ],

    // This option allows use of a custom test runner
    testRunner: "jest-circus/runner",

    // An array of regexp pattern strings that are matched against all source file paths, matched files will skip transformation
    transformIgnorePatterns: [
      "\\\\node_modules\\\\",
      "\\.pnp\\.[^\\\\]+$",
    ],

    // Indicates whether each individual test should be reported during the run
    verbose: true,

  };
};

export default createJestConfig;

