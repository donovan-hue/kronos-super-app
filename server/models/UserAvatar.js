const mongoose = require('mongoose');

const userAvatarSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true
    },
    equippedItems: [
      {
        itemId: { type: mongoose.Schema.Types.ObjectId, ref: 'AvatarItem' },
        category: { type: String }
      }
    ],
    ownedItems: [
      { type: mongoose.Schema.Types.ObjectId, ref: 'AvatarItem' }
    ],
    skinColor: { type: String, default: '#FDBCB4' },
    backgroundColor: { type: String, default: '#7c3aed' }
  },
  { timestamps: true }
);

module.exports = mongoose.model('UserAvatar', userAvatarSchema);
