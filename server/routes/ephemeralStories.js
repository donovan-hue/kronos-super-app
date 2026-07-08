const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const ctrl = require('../controllers/ephemeralStoryController');
const { uploadStory } = require('../middleware/upload');

router.get('/active', protect, ctrl.getActiveStories);
router.get('/mine', protect, ctrl.getMyStories);
router.post('/', protect, uploadStory.single('media'), ctrl.createStory);
router.post('/:id/view', protect, ctrl.viewStory);
router.delete('/:id', protect, ctrl.deleteStory);

module.exports = router;
