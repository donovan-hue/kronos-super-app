const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const ctrl = require('../controllers/avatarController');

router.get('/', protect, ctrl.getMyAvatar);
router.get('/shop', protect, ctrl.getShopItems);
router.post('/buy', protect, ctrl.buyItem);
router.post('/equip', protect, ctrl.equipItem);
router.post('/unequip', protect, ctrl.unequipItem);

module.exports = router;
