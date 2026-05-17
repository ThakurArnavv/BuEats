/**
 * Jest Global Setup & Teardown
 * 
 * - Connects to a dedicated TEST database (not your production one!)
 * - Cleans up collections between tests for isolation
 * - Disconnects after the suite finishes
 */

import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

// Use a separate test database to protect production data
const TEST_MONGO_URI =
  process.env.TEST_MONGO_URI ||
  process.env.MONGO_URI?.replace(/\/[^/?]+(\?|$)/, '/bueats_test$1') ||
  'mongodb://127.0.0.1:27017/bueats_test';

// ── Connect before all tests ────────────────────────────────────────
beforeAll(async () => {
  // Prevent accidental double-connects
  if (mongoose.connection.readyState === 0) {
    await mongoose.connect(TEST_MONGO_URI);
  }
});

// ── Wipe every collection between tests for full isolation ──────────
afterEach(async () => {
  const collections = mongoose.connection.collections;
  for (const key in collections) {
    await collections[key].deleteMany({});
  }
});

// ── Disconnect after all tests ──────────────────────────────────────
afterAll(async () => {
  await mongoose.connection.dropDatabase();
  await mongoose.disconnect();
});
