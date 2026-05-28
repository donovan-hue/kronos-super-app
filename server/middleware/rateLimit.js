const rateLimit = require('express-rate-limit');

exports.authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: process.env.NODE_ENV === 'production' ? 10 : 100,
  message: { message: 'Demasiados intentos. Espera 15 minutos.' },
  standardHeaders: true,
  legacyHeaders: false,
  skip: (req) => process.env.NODE_ENV === 'development'
});

exports.walletLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 20,
  message: { message: 'Demasiadas operaciones. Espera un momento.' },
  standardHeaders: true,
  legacyHeaders: false,
});

exports.apiLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 200,
  message: { message: 'Rate limit excedido.' },
  standardHeaders: true,
  legacyHeaders: false,
});
