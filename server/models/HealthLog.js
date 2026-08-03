const mongoose = require('mongoose');

const healthLogSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    date: {
      type: Date,
      default: Date.now
    },
    steps: {
      type: Number,
      default: 0
    },
    calories: {
      type: Number,
      default: 0
    },
    waterGlasses: {
      type: Number,
      default: 0
    },
    workoutMinutes: {
      type: Number,
      default: 0
    },
    mood: {
      type: String,
      enum: ['great', 'good', 'okay', 'bad', 'terrible'],
      default: 'okay'
    },
    notes: {
      type: String,
      maxlength: 500
    },
    tokensEarned: {
      type: Number,
      default: 0
    }
  },
  { timestamps: true }
);

healthLogSchema.index({ user: 1, date: -1 });

module.exports = mongoose.model('HealthLog', healthLogSchema);
