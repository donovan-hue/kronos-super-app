const mongoose = require('mongoose');

const communityPostSchema = new mongoose.Schema(
  {
    author: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    content: { type: String, required: true, maxlength: 2000 },
    image: { type: String, default: null },
    likes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    comments: [
      {
        author: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
        text: { type: String, maxlength: 500 },
        createdAt: { type: Date, default: Date.now }
      }
    ]
  },
  { timestamps: true }
);

const memberSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    role: { type: String, enum: ['admin', 'mod', 'member'], default: 'member' },
    joinedAt: { type: Date, default: Date.now },
  },
  { _id: false }
);

const communitySchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true, maxlength: 100 },
    description: { type: String, maxlength: 500, default: '' },
    avatar: { type: String, default: null },
    cover: { type: String, default: null },
    creator: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    members: [memberSchema],
    posts: [communityPostSchema],
    privacy: { type: String, enum: ['public', 'private'], default: 'public' },
    category: {
      type: String,
      enum: ['tech', 'art', 'sports', 'music', 'gaming', 'food', 'travel', 'fashion', 'health', 'other'],
      default: 'other'
    },
    rules: [{ type: String, maxlength: 200 }],
    tags: [String]
  },
  { timestamps: true }
);

communitySchema.index({ name: 'text', description: 'text', tags: 'text' });
communitySchema.index({ privacy: 1, category: 1 });

module.exports = mongoose.model('Community', communitySchema);
