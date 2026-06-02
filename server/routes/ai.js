const express = require('express');
const rateLimit = require('express-rate-limit');
const router = express.Router();
const { protect: auth } = require('../middleware/auth');
const { requireFeature } = require('../middleware/requireTier');
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

// Generación IA requiere plan Pro o superior
router.post('/caption',             auth, aiLimiter, requireFeature('aiGenerator'), generateCaption);
router.post('/image',               auth, aiLimiter, requireFeature('aiGenerator'), generateImage);
router.post('/image/variants',      auth, aiLimiter, requireFeature('aiGenerator'), generateImageVariants);
router.post('/product-description', auth, aiLimiter, requireFeature('aiGenerator'), generateProductDescription);
router.post('/hashtags',            auth, aiLimiter, requireFeature('aiGenerator'), generateHashtags);
router.post('/chat',                auth, aiLimiter, requireFeature('aiGenerator'), chat);
router.post('/story',               auth, aiLimiter, requireFeature('aiGenerator'), generateStory);
// Sentiment es uso interno (moderación de posts) — sin restricción de tier
router.post('/sentiment', auth, analyzeSentiment);

module.exports = router;
