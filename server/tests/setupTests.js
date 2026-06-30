/**
 * setupTests.js
 * Manages an in-memory MongoDB instance for the Jest test suite.
 * Import connect/disconnect helpers from here in each test file.
 */
const { MongoMemoryServer } = require('mongodb-memory-server');
const mongoose = require('mongoose');

let mongod;

/** Start in-memory server and connect Mongoose */
const connect = async () => {
  mongod = await MongoMemoryServer.create();
  const uri = mongod.getUri();
  await mongoose.connect(uri);
};

/** Drop the test DB, disconnect, and stop the server */
const close = async () => {
  await mongoose.connection.dropDatabase();
  await mongoose.connection.close();
  await mongod.stop();
};

/** Wipe all collections between tests */
const clear = async () => {
  const collections = mongoose.connection.collections;
  for (const key in collections) {
    await collections[key].deleteMany({});
  }
};

module.exports = { connect, close, clear };
