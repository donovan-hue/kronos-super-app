const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const ctrl = require('../controllers/healthController');

router.get('/today', protect, ctrl.getTodayLog);
router.post('/log', protect, ctrl.upsertLog);
router.get('/history', protect, ctrl.getHistory);
router.get('/stats', protect, ctrl.getStats);

module.exports = router;
