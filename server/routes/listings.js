const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const ctrl = require('../controllers/listingController');

router.get('/', ctrl.getListings);
router.get('/mine', protect, ctrl.getMyListings);
router.post('/', protect, ctrl.createListing);
router.get('/:id', ctrl.getListing);
router.post('/:id/buy', protect, ctrl.buyListing);
router.post('/:id/release', protect, ctrl.releaseFunds);
router.post('/:id/cancel', protect, ctrl.cancelEscrow);
router.delete('/:id', protect, ctrl.deleteListing);

module.exports = router;
