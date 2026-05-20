const mongoose = require('mongoose');

const listingSchema = new mongoose.Schema(
  {
    seller: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    title: { type: String, required: true, trim: true, maxlength: 120 },
    description: { type: String, maxlength: 2000, default: '' },
    price: { type: Number, required: true, min: 0 },
    currency: { type: String, default: 'USD' },
    images: [{ type: String }],
    category: {
      type: String,
      enum: ['electronics', 'clothing', 'furniture', 'vehicles', 'books', 'sports', 'art', 'collectibles', 'services', 'other'],
      default: 'other'
    },
    condition: { type: String, enum: ['new', 'like_new', 'good', 'fair', 'poor'], default: 'good' },
    location: { type: String, default: '' },
    status: { type: String, enum: ['active', 'reserved', 'sold', 'removed'], default: 'active', index: true },
    views: { type: Number, default: 0 },
    tags: [String]
  },
  { timestamps: true }
);

listingSchema.index({ status: 1, category: 1, createdAt: -1 });
listingSchema.index({ title: 'text', description: 'text', tags: 'text' });

module.exports = mongoose.model('Listing', listingSchema);
