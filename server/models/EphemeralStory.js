const mongoose = require('mongoose');

const ephemeralStorySchema = new mongoose.Schema(
  {
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true
    },
    mediaUrl: { type: String, default: null },
    mediaType: {
      type: String,
      enum: ['image', 'video', 'text'],
      default: 'text'
    },
    text: { type: String, maxlength: 300, default: '' },
    bgColor: { type: String, default: '#7c3aed' },
    expiresAt: {
      type: Date,
      default: () => new Date(Date.now() + 24 * 60 * 60 * 1000),
      index: { expireAfterSeconds: 0 }
    },
    viewers: [
      {
        user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
        viewedAt: { type: Date, default: Date.now }
      }
    ]
  },
  { timestamps: true }
);

ephemeralStorySchema.index({ author: 1, expiresAt: 1 });

module.exports = mongoose.model('EphemeralStory', ephemeralStorySchema);
