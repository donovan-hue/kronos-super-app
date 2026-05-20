const mongoose = require('mongoose');

function generateCardNumber() {
  const groups = [];
  for (let i = 0; i < 4; i++) {
    groups.push(String(Math.floor(1000 + Math.random() * 9000)));
  }
  return groups.join(' ');
}

function generateCVV() {
  return String(Math.floor(100 + Math.random() * 900));
}

function generateExpiry() {
  const now = new Date();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const year = String(now.getFullYear() + 4).slice(-2);
  return `${month}/${year}`;
}

const virtualCardSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
    cardNumber: { type: String, default: generateCardNumber },
    cvv: { type: String, default: generateCVV },
    expiry: { type: String, default: generateExpiry },
    cardholderName: { type: String, required: true },
    frozen: { type: Boolean, default: false },
    spendingLimit: { type: Number, default: 500 },
    totalSpent: { type: Number, default: 0 },
    network: { type: String, default: 'VISA' }
  },
  { timestamps: true }
);

module.exports = mongoose.model('VirtualCard', virtualCardSchema);
