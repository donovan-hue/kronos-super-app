const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const { postLimiter } = require('../middleware/postLimiter');
const {
  createPost,
  getFeed,
  getUserPosts,
  likePost,
  commentPost,
  deletePost,
  bookmarkPost,
  getBookmarkedPosts,
} = require('../controllers/postController');

router.post('/', protect, postLimiter, createPost);
router.get('/feed', protect, getFeed);
router.get('/bookmarked', protect, getBookmarkedPosts);
router.get('/user/:userId', getUserPosts);
router.post('/:postId/like', protect, likePost);
router.post('/:postId/comment', protect, commentPost);
router.post('/:postId/bookmark', protect, bookmarkPost);
router.delete('/:postId', protect, deletePost);

module.exports = router;
