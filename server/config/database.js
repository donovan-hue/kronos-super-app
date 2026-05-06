const mongoose = require('mongoose');

const connectDB = async () => {
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    console.warn('[DB] MONGODB_URI no definida. Server arranca sin DB.');
    return;
  }
  try {
    await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 30000,
      socketTimeoutMS: 60000,
    });
    console.log('✓ MongoDB Connected:', mongoose.connection.host || 'Atlas');
  } catch (error) {
    console.error('✗ MongoDB Connection Error:', error.message);
    console.error('↻ Reintentando en 30s. Revisa MONGODB_URI en .env');
    setTimeout(connectDB, 30000);
  }
};

module.exports = connectDB;
