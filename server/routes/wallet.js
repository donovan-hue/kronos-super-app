const { walletLimiter } = require('../middleware/rateLimit');
const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const ctrl = require('../controllers/walletController');

router.get('/', protect, ctrl.getWallet);
router.post('/deposit', walletLimiter, protect, ctrl.deposit);
router.post('/transfer', walletLimiter, protect, ctrl.transfer);
router.get('/transactions', protect, ctrl.getTransactions);
router.get('/card', protect, ctrl.getCard);
router.post('/card/freeze', protect, ctrl.toggleFreezeCard);

router.get('/daily-reward', protect, require('../controllers/walletController').getDailyReward);
router.post('/daily-reward', protect, require('../controllers/walletController').claimDailyReward);

module.exports = router;
