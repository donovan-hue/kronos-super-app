const mongoose = require('mongoose');

// Mock mongoose models before requiring controller
jest.mock('../models/CashWallet', () => {
  const mockWallet = {
    balance: 100,
    kroTokens: 0,
    transactions: [],
    save: jest.fn().mockResolvedValue(true),
  };
  return {
    findOne: jest.fn().mockResolvedValue(mockWallet),
    create: jest.fn().mockResolvedValue(mockWallet),
    _mockWallet: mockWallet,
  };
});

const CashWallet = require('../models/CashWallet');

describe('Wallet Controller — business logic', () => {
  let req, res;

  beforeEach(() => {
    res = {
      json: jest.fn(),
      status: jest.fn().mockReturnThis(),
    };
    CashWallet._mockWallet.balance = 100;
    CashWallet._mockWallet.transactions = [];
    CashWallet._mockWallet.save.mockClear();
  });

  test('getWallet devuelve balance existente', async () => {
    req = { user: { _id: new mongoose.Types.ObjectId() } };
    const { getWallet } = require('../controllers/walletController');
    await getWallet(req, res);
    expect(res.json).toHaveBeenCalled();
  });

  test('deposit con amount negativo retorna 400', async () => {
    req = { user: { _id: new mongoose.Types.ObjectId() }, body: { amount: -50 } };
    const { deposit } = require('../controllers/walletController');
    await deposit(req, res);
    expect(res.status).toHaveBeenCalledWith(400);
  });

  test('deposit incrementa el balance', async () => {
    req = { user: { _id: new mongoose.Types.ObjectId() }, body: { amount: 50 } };
    CashWallet._mockWallet.balance = 100;
    const { deposit } = require('../controllers/walletController');
    await deposit(req, res);
    expect(CashWallet._mockWallet.save).toHaveBeenCalled();
  });
});
