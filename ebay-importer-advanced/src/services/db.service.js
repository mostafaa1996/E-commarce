const mongoose = require('mongoose');
const { mongodb } = require('../config/env');

async function connectDb() {
  await mongoose.connect(mongodb.uri);
  console.log('Connected to MongoDB');
}

async function disconnectDb() {
  await mongoose.disconnect();
  console.log('Disconnected from MongoDB');
}

module.exports = { connectDb, disconnectDb };
