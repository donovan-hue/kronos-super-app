const mongoose = require('mongoose');

const cashTransactionSchema = new mongoose.Schema(
  {
    type: { type: String, enum: ['deposit', 'withdrawal', 'transfer_in', 'transfer_out', 'payment', 'refund'], required: true },
    amount: { type: Number, required: true },
    currency: { type: String, default: 'USD' },
    description: { type: String, default: '' },
    counterparty: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
    reference: { type: String, default: null },
    status: { type: String, enum: ['pending', 'completed', 'failed'], default: 'completed' }
  },
  { timestamps: true }
);

const cashWalletSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
  kroTokens: { type: Number, default: 0 },
  rewardStreak: { type: Number, default: 0 },
  lastDailyReward: { type: Date, default: null },
    balance: { type: Number, default: 0, min: 0 },
    currency: { type: String, default: 'USD' },
    transactions: [cashTransactionSchema],
    isLocked: { type: Boolean, default: false }
  },
  { timestamps: true }
);

cashWalletSchema.index({ user: 1 });

module.exports = mongoose.model('CashWallet', cashWalletSchema);
