const Reservation = require('../models/Reservation');

// GET /api/reservations/mine
exports.getReservations = async (req, res) => {
  try {
    const reservations = await Reservation.find({ user: req.user._id })
      .sort({ date: -1 })
      .lean();
    res.json({ success: true, data: reservations });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// POST /api/reservations
exports.createReservation = async (req, res) => {
  try {
    const { businessName, businessType, date, time, partySize, notes } = req.body;

    if (!businessName || !date || !time) {
      return res.status(400).json({ success: false, message: 'businessName, date y time son requeridos' });
    }

    const reservation = await Reservation.create({
      user: req.user._id,
      businessName,
      businessType: businessType || 'other',
      date: new Date(date),
      time,
      partySize: partySize || 1,
      notes: notes || '',
      status: 'pending'
    });

    res.status(201).json({ success: true, data: reservation });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// PUT /api/reservations/:id/confirm
exports.confirmReservation = async (req, res) => {
  try {
    const reservation = await Reservation.findById(req.params.id);

    if (!reservation) {
      return res.status(404).json({ success: false, message: 'Reservación no encontrada' });
    }

    if (reservation.status === 'cancelled') {
      return res.status(400).json({ success: false, message: 'No se puede confirmar una reservación cancelada' });
    }

    reservation.status = 'confirmed';
    await reservation.save();

    res.json({ success: true, data: reservation });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// DELETE /api/reservations/:id
exports.cancelReservation = async (req, res) => {
  try {
    const reservation = await Reservation.findById(req.params.id);

    if (!reservation) {
      return res.status(404).json({ success: false, message: 'Reservación no encontrada' });
    }

    if (reservation.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: 'No autorizado' });
    }

    if (reservation.status === 'cancelled') {
      return res.status(400).json({ success: false, message: 'Ya está cancelada' });
    }

    reservation.status = 'cancelled';
    await reservation.save();

    res.json({ success: true, data: reservation, message: 'Reservación cancelada' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
