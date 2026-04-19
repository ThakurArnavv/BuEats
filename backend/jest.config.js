/**
 * Jest Configuration for BuEats Backend
 *
 * Key decisions:
 *  - Uses the experimental ESM transform so `import/export` works natively
 *  - Loads tests/setup.js for DB lifecycle (connect → clean → disconnect)
 *  - 30 s timeout because MongoDB operations can be slow on first run
 */

export default {
  // Use the native ESM transform (requires --experimental-vm-modules)
  transform: {},

  setupFilesAfterEnv: ['./tests/setup.js'],

  // Recognise .test.js files inside /tests
  testMatch: ['**/tests/**/*.test.js'],

  // Give each test generous time for DB ops
  testTimeout: 30000,

  // Force exit after tests so hanging DB connections don't block CI
  forceExit: true,

  // Verbose output for better readability
  verbose: true,
};
