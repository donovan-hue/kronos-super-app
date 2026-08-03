const mongoose = require('mongoose');

const avatarItemSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    category: {
      type: String,
      enum: ['hair', 'skin', 'accessory', 'outfit', 'background'],
      required: true
    },
    description: { type: String, default: '' },
    price: { type: Number, required: true, default: 0 },
    imageEmoji: { type: String, default: '❓' },
    rarity: {
      type: String,
      enum: ['common', 'rare', 'epic', 'legendary'],
      default: 'common'
    },
    isDefault: { type: Boolean, default: false }
  },
  { timestamps: true }
);

module.exports = mongoose.model('AvatarItem', avatarItemSchema);
