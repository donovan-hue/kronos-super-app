const mongoose = require('mongoose');

const voteSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true
    },
    targetType: {
      type: String,
      enum: ['Post', 'Comment', 'Story', 'Listing'],
      required: true,
      index: true
    },
    targetId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      index: true
    },
    voteType: {
      type: String,
      enum: ['upvote', 'downvote', 'like', 'heart', 'fire', 'star'],
      required: true
    }
  },
  { timestamps: true }
);

// Previene votos o reacciones duplicadas por usuario en la misma entidad
voteSchema.index({ userId: 1, targetId: 1, targetType: 1 }, { unique: true });

module.exports = mongoose.model('Vote', voteSchema);

