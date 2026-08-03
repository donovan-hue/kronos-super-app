const mongoose = require('mongoose');

// Log de eventos de conexión para diagnosticar caídas en los logs de Render.
let listenersRegistered = false;
const registerListeners = () => {
  if (listenersRegistered) return;
  listenersRegistered = true;
  mongoose.connection.on('disconnected', () => console.warn('[DB] ⚠️  Desconectado de MongoDB'));
  mongoose.connection.on('reconnected', () => console.log('[DB] ✓ Reconectado a MongoDB'));
  mongoose.connection.on('error', (err) => console.error('[DB] Error de conexión:', err.message));
};

const connectDB = async () => {
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    console.warn('[DB] MONGODB_URI no definida. Server arranca sin DB.');
    return;
  }
  registerListeners();
  try {
    await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 8000, // falla rápido y reintenta en vez de colgar
      socketTimeoutMS: 45000,
    });
    console.log('✓ MongoDB Connected:', mongoose.connection.host || 'Atlas');
  } catch (error) {
    console.error('✗ MongoDB Connection Error:', error.message);
    console.error('↻ Reintentando en 10s. Revisa MONGODB_URI y la lista de IPs en Atlas (0.0.0.0/0).');
    setTimeout(connectDB, 10000);
  }
};

module.exports = connectDB;
