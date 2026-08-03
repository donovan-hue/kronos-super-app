const express = require('express');
const router = express.Router();
const tokenController = require('../controllers/tokenController');
const { protect } = require('../middleware/auth');
const { web3Protect } = require('../middleware/web3Auth');

// Initialize wallet — requiere usuario Web3 verificado
router.post('/wallet/init', web3Protect, tokenController.initializeWallet);

// Get balance — accesible por usuarios regulares y Web3
router.get('/balance', protect, tokenController.getBalance);

// Transfer tokens — requiere usuario Web3 verificado
router.post('/transfer', web3Protect, tokenController.transferTokens);

// Staking — requiere usuario Web3 verificado
router.post('/stake', web3Protect, tokenController.stakeTokens);
router.get('/stakes', protect, tokenController.getStakes);
router.post('/claim-rewards', web3Protect, tokenController.claimRewards);

// Attention tracking
router.post('/track-attention', protect, tokenController.trackAttention);
router.get('/attention-metrics', protect, tokenController.getAttentionMetrics);

// Creator earnings
router.get('/creator-earnings', protect, tokenController.getCreatorEarnings);

// Leaderboard
router.get('/leaderboard', tokenController.getLeaderboard);

// Transactions
router.get('/transactions', protect, tokenController.getTransactions);

// Token info
router.get('/info', tokenController.getTokenInfo);

module.exports = router;
