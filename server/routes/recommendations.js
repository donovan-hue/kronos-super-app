const express = require('express');
const router = express.Router();
const { protect: auth } = require('../middleware/auth');
const {
  getRecommendedPosts,
  getRecommendedUsers,
  getRecommendedProducts,
  getRecommendedListings,
  getTrending,
  trackInteraction,
  getUserProfile
} = require('../controllers/recommendationController');

router.get('/posts', auth, getRecommendedPosts);
router.get('/users', auth, getRecommendedUsers);
router.get('/products', auth, getRecommendedProducts);
router.get('/listings', auth, getRecommendedListings);
router.get('/trending', getTrending);
router.post('/track', auth, trackInteraction);
router.get('/profile', auth, getUserProfile);

module.exports = router;
