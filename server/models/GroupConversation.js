const mongoose = require('mongoose');

const groupConversationSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true, maxlength: 80 },
    description: { type: String, maxlength: 300, default: '' },
    avatar: { type: String, default: null },
    creator: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    members: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    admins: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    lastMessage: {
      content: { type: String, default: '' },
      author: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
      at: { type: Date, default: Date.now }
    }
  },
  { timestamps: true }
);

groupConversationSchema.index({ members: 1, updatedAt: -1 });

module.exports = mongoose.model('GroupConversation', groupConversationSchema);
