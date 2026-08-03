const express = require('express');
const rateLimit = require('express-rate-limit');
const router = express.Router();
const { protect: auth } = require('../middleware/auth');
const { requireQuota } = require('../middleware/requireProductQuota');
const {
  generateCaption, generateImage, generateImageVariants,
  analyzeSentiment, generateProductDescription,
  generateHashtags, chat, generateStory
} = require('../controllers/aiController');

const aiLimiter = rateLimit({
  windowMs: 60 * 1000,
  limit: 20,
  message: { error: 'Too many AI requests. Please wait a moment.' },
  standardHeaders: true,
  legacyHeaders: false,
});

// ── Producto "Scripts" (texto, gpt-4o-mini): consume cuota de guiones ──
router.post('/story',               auth, aiLimiter, requireQuota('scripts'), generateStory);
router.post('/caption',             auth, aiLimiter, requireQuota('scripts'), generateCaption);
router.post('/hashtags',            auth, aiLimiter, requireQuota('scripts'), generateHashtags);
router.post('/product-description', auth, aiLimiter, requireQuota('scripts'), generateProductDescription);
router.post('/chat',                auth, aiLimiter, requireQuota('scripts'), chat);

// ── Producto "Media" (imágenes): consume cuota de imágenes ──
router.post('/image',               auth, aiLimiter, requireQuota('images'), generateImage);
router.post('/image/variants',      auth, aiLimiter, requireQuota('images'), generateImageVariants);

// Sentiment es uso interno (moderación de posts) — sin restricción
router.post('/sentiment', auth, analyzeSentiment);

module.exports = router;
