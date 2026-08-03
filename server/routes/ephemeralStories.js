const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const ctrl = require('../controllers/ephemeralStoryController');

router.get('/active', protect, ctrl.getActiveStories);
router.get('/mine', protect, ctrl.getMyStories);
router.post('/', protect, ctrl.uploadMiddleware, ctrl.createStory);
router.post('/:id/view', protect, ctrl.viewStory);
router.delete('/:id', protect, ctrl.deleteStory);

module.exports = router;
