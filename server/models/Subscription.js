const mongoose = require('mongoose');

const subscriptionSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true
    },
    // Cuál de los 3 productos independientes (social | scripts | media).
    productId: {
      type: String,
      enum: ['social', 'scripts', 'media'],
      index: true
    },
    // Plan dentro del producto (free | premium | estandar | pro).
    planKey: {
      type: String
    },
    // Legacy: tier del modelo viejo. Se conserva por compatibilidad.
    tier: {
      type: String,
      default: 'free'
    },
    stripeCustomerId: {
      type: String,
      index: true,
      sparse: true
    },
    stripeSubscriptionId: {
      type: String,
      index: true,
      sparse: true,
      unique: true
    },
    stripePriceId: {
      type: String
    },
    status: {
      type: String,
      enum: ['active', 'canceled', 'past_due', 'trialing', 'incomplete', 'unpaid'],
      default: 'active',
      index: true
    },
    currentPeriodStart: Date,
    currentPeriodEnd: Date,
    cancelAtPeriodEnd: {
      type: Boolean,
      default: false
    },
    canceledAt: Date
  },
  { timestamps: true }
);

subscriptionSchema.index({ userId: 1, status: 1 });

module.exports = mongoose.model('Subscription', subscriptionSchema);
