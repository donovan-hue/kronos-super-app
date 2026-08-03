const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const ctrl = require('../controllers/reservationController');

router.get('/mine', protect, ctrl.getReservations);
router.post('/', protect, ctrl.createReservation);
router.put('/:id/confirm', protect, ctrl.confirmReservation);
router.delete('/:id', protect, ctrl.cancelReservation);

module.exports = router;
