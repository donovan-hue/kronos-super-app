const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const ctrl = require('../controllers/communityController');

router.get('/', protect, ctrl.getCommunities);
router.get('/mine', protect, ctrl.getMyCommunitiesController);
router.post('/', protect, ctrl.createCommunity);
router.get('/:id', protect, ctrl.getCommunity);
router.post('/:id/join', protect, ctrl.joinCommunity);
router.post('/:id/posts', protect, ctrl.createPost);
router.post('/:id/posts/:postId/like', protect, ctrl.likePost);
router.post('/:id/posts/:postId/comment', protect, ctrl.commentPost);
router.delete('/:id/posts/:postId', protect, ctrl.deletePost);
router.put('/:id/members/role', protect, ctrl.assignRole);

module.exports = router;
