const mongoose = require('mongoose');

const reservationSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    businessName: {
      type: String,
      required: [true, 'Business name is required'],
      maxlength: 200
    },
    businessType: {
      type: String,
      enum: ['restaurant', 'salon', 'medical', 'hotel', 'other'],
      default: 'other'
    },
    date: {
      type: Date,
      required: [true, 'Date is required']
    },
    time: {
      type: String,
      required: [true, 'Time is required']
    },
    partySize: {
      type: Number,
      min: 1,
      max: 20,
      default: 1
    },
    notes: {
      type: String,
      maxlength: 500
    },
    status: {
      type: String,
      enum: ['pending', 'confirmed', 'cancelled'],
      default: 'pending'
    }
  },
  { timestamps: true }
);

reservationSchema.index({ user: 1, date: -1 });
reservationSchema.index({ status: 1 });

module.exports = mongoose.model('Reservation', reservationSchema);
