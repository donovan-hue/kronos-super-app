const AvatarItem = require('../models/AvatarItem');
const UserAvatar = require('../models/UserAvatar');
const CashWallet = require('../models/CashWallet');

// ── Default items seed ────────────────────────────────────────────────────────

const DEFAULT_ITEMS = [
  { name: 'Cabello Negro', category: 'hair', description: 'Clásico cabello negro', price: 0, imageEmoji: '🖤', rarity: 'common', isDefault: true },
  { name: 'Cabello Rubio', category: 'hair', description: 'Brillante cabello rubio', price: 50, imageEmoji: '💛', rarity: 'common', isDefault: false },
  { name: 'Cabello Morado', category: 'hair', description: 'Vibrante cabello morado', price: 100, imageEmoji: '💜', rarity: 'rare', isDefault: false },
  { name: 'Gafas', category: 'accessory', description: 'Gafas de sol cool', price: 75, imageEmoji: '🕶️', rarity: 'common', isDefault: false },
  { name: 'Corona', category: 'accessory', description: 'Corona de la realeza', price: 500, imageEmoji: '👑', rarity: 'legendary', isDefault: false },
  { name: 'Outfit Casual', category: 'outfit', description: 'Look casual y cómodo', price: 150, imageEmoji: '👕', rarity: 'common', isDefault: false },
  { name: 'Outfit Gamer', category: 'outfit', description: 'Para los gamers hardcore', price: 300, imageEmoji: '🎮', rarity: 'rare', isDefault: false },
  { name: 'Fondo Galaxia', category: 'background', description: 'Un fondo de galaxia épico', price: 200, imageEmoji: '🌌', rarity: 'epic', isDefault: false },
];

async function seedDefaultItems() {
  try {
    const count = await AvatarItem.countDocuments();
    if (count === 0) {
      await AvatarItem.insertMany(DEFAULT_ITEMS);
      console.log('✓ Avatar default items seeded');
    }
  } catch (err) {
    console.error('Failed to seed avatar items:', err.message);
  }
}

// ── Helper ────────────────────────────────────────────────────────────────────

async function getOrCreateAvatar(userId) {
  let avatar = await UserAvatar.findOne({ user: userId })
    .populate('equippedItems.itemId')
    .populate('ownedItems');
  if (!avatar) {
    // Auto-equip all default items on first creation
    const defaults = await AvatarItem.find({ isDefault: true });
    const equippedItems = defaults.map(item => ({ itemId: item._id, category: item.category }));
    const ownedItems = defaults.map(item => item._id);
    avatar = await UserAvatar.create({ user: userId, equippedItems, ownedItems });
    avatar = await UserAvatar.findById(avatar._id)
      .populate('equippedItems.itemId')
      .populate('ownedItems');
  }
  return avatar;
}

// ── Controllers ───────────────────────────────────────────────────────────────

exports.getMyAvatar = async (req, res) => {
  try {
    const avatar = await getOrCreateAvatar(req.user._id);
    res.json({ success: true, data: avatar });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.getShopItems = async (req, res) => {
  try {
    const items = await AvatarItem.find().sort({ category: 1, price: 1 });
    res.json({ success: true, data: items });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.buyItem = async (req, res) => {
  try {
    const { itemId } = req.body;
    if (!itemId) return res.status(400).json({ success: false, message: 'itemId requerido' });

    const item = await AvatarItem.findById(itemId);
    if (!item) return res.status(404).json({ success: false, message: 'Item no encontrado' });

    const avatar = await getOrCreateAvatar(req.user._id);

    // Check if already owned
    const alreadyOwned = avatar.ownedItems.some(
      owned => owned._id.toString() === itemId || owned.toString() === itemId
    );
    if (alreadyOwned) {
      return res.status(400).json({ success: false, message: 'Ya tienes este item' });
    }

    // Check tokens (use CashWallet.kroTokens)
    let wallet = await CashWallet.findOne({ user: req.user._id });
    if (!wallet) {
      wallet = await CashWallet.create({ user: req.user._id });
    }

    const currentTokens = wallet.kroTokens || 0;
    if (currentTokens < item.price) {
      return res.status(400).json({
        success: false,
        message: `Tokens insuficientes. Necesitas ${item.price}, tienes ${currentTokens}`
      });
    }

    // Deduct tokens
    wallet.kroTokens = currentTokens - item.price;
    await wallet.save();

    // Add to owned items (work with raw ObjectId array)
    await UserAvatar.updateOne(
      { user: req.user._id },
      { $push: { ownedItems: item._id } }
    );

    res.json({
      success: true,
      message: `¡${item.name} comprado!`,
      tokensRemaining: wallet.kroTokens
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.equipItem = async (req, res) => {
  try {
    const { itemId } = req.body;
    if (!itemId) return res.status(400).json({ success: false, message: 'itemId requerido' });

    const item = await AvatarItem.findById(itemId);
    if (!item) return res.status(404).json({ success: false, message: 'Item no encontrado' });

    const avatar = await UserAvatar.findOne({ user: req.user._id }).populate('ownedItems');
    if (!avatar) return res.status(404).json({ success: false, message: 'Avatar no encontrado' });

    // Verify ownership
    const owns = avatar.ownedItems.some(
      owned => owned._id.toString() === itemId || owned.toString() === itemId
    );
    if (!owns) {
      return res.status(403).json({ success: false, message: 'No tienes este item' });
    }

    // Replace or add equipped item for this category
    const equipped = avatar.equippedItems.filter(e => e.category !== item.category);
    equipped.push({ itemId: item._id, category: item.category });
    avatar.equippedItems = equipped;
    await avatar.save();

    const updated = await UserAvatar.findById(avatar._id)
      .populate('equippedItems.itemId')
      .populate('ownedItems');

    res.json({ success: true, message: `${item.name} equipado`, data: updated });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.unequipItem = async (req, res) => {
  try {
    const { itemId } = req.body;
    if (!itemId) return res.status(400).json({ success: false, message: 'itemId requerido' });

    const avatar = await UserAvatar.findOne({ user: req.user._id });
    if (!avatar) return res.status(404).json({ success: false, message: 'Avatar no encontrado' });

    avatar.equippedItems = avatar.equippedItems.filter(
      e => e.itemId.toString() !== itemId
    );
    await avatar.save();

    const updated = await UserAvatar.findById(avatar._id)
      .populate('equippedItems.itemId')
      .populate('ownedItems');

    res.json({ success: true, message: 'Item desequipado', data: updated });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.seedDefaultItems = seedDefaultItems;
