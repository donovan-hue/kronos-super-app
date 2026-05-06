const mongoose = require('mongoose');

const RETRY_DELAY_MS = 30000;

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      serverSelectionTimeoutMS: 30000,
      socketTimeoutMS: 60000,
      connectTimeoutMS: 30000
    });
    console.log('✓ MongoDB Connected:', mongoose.connection.host);
  } catch (error) {
    console.error('✗ MongoDB Connection Error:', error.message);
    console.error(`↻ Reintentando en ${RETRY_DELAY_MS / 1000}s. Revisa MONGODB_URI en .env`);
    setTimeout(connectDB, RETRY_DELAY_MS);
  }
};

mongoose.connection.on('disconnected', () => {
  console.warn('⚠ MongoDB disconnected. Reintentando...');
  setTimeout(connectDB, RETRY_DELAY_MS);
});

module.exports = connectDB;
