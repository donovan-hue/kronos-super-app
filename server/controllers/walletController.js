const CashWallet = require('../models/CashWallet');
const VirtualCard = require('../models/VirtualCard');
const User = require('../models/User');
const UserWallet = require('../models/UserWallet');

// ── Helpers ──────────────────────────────────────────────────────────────────

async function getOrCreateCashWallet(userId) {
  let wallet = await CashWallet.findOne({ user: userId });
  if (!wallet) {
    wallet = await CashWallet.create({ user: userId, balance: 0 });
  }
  return wallet;
}

// ── Cash Wallet ───────────────────────────────────────────────────────────────

exports.getWallet = async (req, res) => {
  try {
    const cashWallet = await getOrCreateCashWallet(req.user._id);
    await cashWallet.populate('transactions.counterparty', 'username firstName lastName avatar');

    let kroWallet = null;
    try {
      kroWallet = await UserWallet.findOne({ userId: req.user._id });
    } catch (_) {}

    res.json({
      success: true,
      cash: {
        balance: cashWallet.balance,
        currency: cashWallet.currency,
        isLocked: cashWallet.isLocked,
        transactions: cashWallet.transactions.slice(-30).reverse()
      },
      kro: kroWallet ? {
        tokenBalance: kroWallet.tokenBalance?.toString() || '0',
        stakedTokens: kroWallet.stakedTokens?.toString() || '0',
        pendingRewards: kroWallet.pendingRewards?.toString() || '0'
      } : null
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.deposit = async (req, res) => {
  try {
    const { amount } = req.body;
    if (!amount || amount <= 0) return res.status(400).json({ success: false, message: 'Invalid amount' });
    if (amount > 10000) return res.status(400).json({ success: false, message: 'Max deposit $10,000' });

    const wallet = await getOrCreateCashWallet(req.user._id);
    wallet.balance += Number(amount);
    wallet.transactions.push({ type: 'deposit', amount: Number(amount), description: 'Depósito manual' });
    await wallet.save();

    res.json({ success: true, balance: wallet.balance, message: `$${amount} depositados correctamente` });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.transfer = async (req, res) => {
  try {
    const { toUserId, amount, description } = req.body;
    if (!toUserId || !amount || amount <= 0) return res.status(400).json({ success: false, message: 'Datos inválidos' });

    const recipient = await User.findById(toUserId);
    if (!recipient) return res.status(404).json({ success: false, message: 'Usuario no encontrado' });
    if (toUserId === req.user._id.toString()) return res.status(400).json({ success: false, message: 'No puedes enviarte dinero a ti mismo' });

    const senderWallet = await getOrCreateCashWallet(req.user._id);
    if (senderWallet.balance < Number(amount)) return res.status(400).json({ success: false, message: 'Saldo insuficiente' });
    if (senderWallet.isLocked) return res.status(403).json({ success: false, message: 'Wallet bloqueada' });

    const recipientWallet = await getOrCreateCashWallet(toUserId);
    const desc = description || `Transferencia a ${recipient.firstName || recipient.username}`;

    senderWallet.balance -= Number(amount);
    senderWallet.transactions.push({ type: 'transfer_out', amount: Number(amount), description: desc, counterparty: toUserId, status: 'completed' });

    recipientWallet.balance += Number(amount);
    recipientWallet.transactions.push({ type: 'transfer_in', amount: Number(amount), description: `Transferencia de ${req.user.firstName || req.user.username}`, counterparty: req.user._id, status: 'completed' });

    await Promise.all([senderWallet.save(), recipientWallet.save()]);

    res.json({
      success: true,
      balance: senderWallet.balance,
      message: `$${amount} enviados a ${recipient.firstName || recipient.username}`
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.getTransactions = async (req, res) => {
  try {
    const wallet = await getOrCreateCashWallet(req.user._id);
    await wallet.populate('transactions.counterparty', 'username firstName lastName avatar');
    const txs = wallet.transactions.slice().reverse();
    res.json({ success: true, data: txs, balance: wallet.balance });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// ── Virtual Card ──────────────────────────────────────────────────────────────

exports.getCard = async (req, res) => {
  try {
    let card = await VirtualCard.findOne({ user: req.user._id });
    if (!card) {
      const name = `${req.user.firstName || ''} ${req.user.lastName || req.user.username}`.trim().toUpperCase();
      card = await VirtualCard.create({ user: req.user._id, cardholderName: name });
    }
    res.json({ success: true, data: card });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.toggleFreezeCard = async (req, res) => {
  try {
    const card = await VirtualCard.findOne({ user: req.user._id });
    if (!card) return res.status(404).json({ success: false, message: 'No tienes tarjeta aún' });
    card.frozen = !card.frozen;
    await card.save();
    res.json({ success: true, frozen: card.frozen, message: card.frozen ? 'Tarjeta congelada' : 'Tarjeta activada' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

const MS_PER_DAY = 86400000;

exports.getDailyReward = async (req, res) => {
  try {
    const wallet = await getOrCreateCashWallet(req.user._id);
    const now = Date.now();
    const lastClaim = wallet.lastDailyReward ? new Date(wallet.lastDailyReward).getTime() : 0;
    const claimed = (now - lastClaim) < MS_PER_DAY;
    const streakDays = wallet.rewardStreak || 0;
    const reward = Math.min(10 + streakDays * 2, 50);
    res.json({ claimed, streakDays, reward, nextClaimAt: claimed ? lastClaim + MS_PER_DAY : null });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.claimDailyReward = async (req, res) => {
  try {
    const wallet = await getOrCreateCashWallet(req.user._id);
    const now = Date.now();
    const lastClaim = wallet.lastDailyReward ? new Date(wallet.lastDailyReward).getTime() : 0;
    if ((now - lastClaim) < MS_PER_DAY) {
      return res.status(400).json({ message: 'Ya reclamaste tu recompensa hoy' });
    }
    const yesterday = now - MS_PER_DAY * 1.5;
    const isConsecutive = lastClaim > yesterday;
    wallet.rewardStreak = isConsecutive ? (wallet.rewardStreak || 0) + 1 : 1;
    const reward = Math.min(10 + wallet.rewardStreak * 2, 50);
    wallet.kroTokens = (wallet.kroTokens || 0) + reward;
    wallet.lastDailyReward = new Date();
    await wallet.save();
    res.json({ reward, streakDays: wallet.rewardStreak, newBalance: wallet.kroTokens });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
