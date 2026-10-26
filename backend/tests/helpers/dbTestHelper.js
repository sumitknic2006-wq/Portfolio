import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { seedDatabase } from '../../src/scripts/seed.js';

let mongod = null;

/**
 * Start in-memory MongoDB server and connect Mongoose
 */
export async function setupTestDB() {
  if (!mongod) {
    mongod = await MongoMemoryServer.create();
    const uri = mongod.getUri();
    if (mongoose.connection.readyState === 0) {
      await mongoose.connect(uri);
    }
  } else if (mongoose.connection.readyState === 0) {
    await mongoose.connect(mongod.getUri());
  }
  return mongod;
}

/**
 * Seed the in-memory database with verified portfolio fixtures
 */
export async function seedTestDB() {
  await setupTestDB();
  return seedDatabase();
}

/**
 * Clear all documents in all collections
 */
export async function clearTestDB() {
  if (mongoose.connection.readyState === 1) {
    const collections = mongoose.connection.collections;
    for (const key in collections) {
      await collections[key].deleteMany({});
    }
  }
}

/**
 * Disconnect Mongoose and stop in-memory MongoDB
 */
export async function teardownTestDB() {
  if (mongoose.connection.readyState !== 0) {
    await mongoose.disconnect();
  }
  if (mongod) {
    await mongod.stop();
    mongod = null;
  }
}

export default {
  setupTestDB,
  seedTestDB,
  clearTestDB,
  teardownTestDB,
};
