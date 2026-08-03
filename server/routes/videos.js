const express = require('express');
const rateLimit = require('express-rate-limit');
const { protect: auth } = require('../middleware/auth');
const { uploadVideo } = require('../middleware/upload');
const videoController = require('../controllers/videoController');

const router = express.Router();

const uploadLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  limit: 10,
  message: { error: 'Too many video uploads. Try again in an hour.' },
  standardHeaders: true,
  legacyHeaders: false,
});

// Upload video
router.post('/', auth, uploadLimiter, uploadVideo.single('video'), videoController.uploadVideo);

// Get videos
router.get('/public', videoController.getPublicVideos);
router.get('/user', auth, videoController.getUserVideos);
router.get('/:videoId', videoController.getVideo);

// Like video
router.post('/:videoId/like', auth, videoController.likeVideo);

// Delete video
router.delete('/:videoId', auth, videoController.deleteVideo);

module.exports = router;
