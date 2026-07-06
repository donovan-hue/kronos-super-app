const ethers = require('ethers');
const mongoose = require('mongoose');
const KronosToken = require('../models/KronosToken');
const UserWallet = require('../models/UserWallet');
const Stake = require('../models/Stake');
const Transaction = require('../models/Transaction');
const AttentionMetrics = require('../models/AttentionMetrics');

const ERC20_ABI = [
  'function balanceOf(address) public view returns (uint256)',
  'function transfer(address to, uint256 amount) public returns (bool)',
  'function approve(address spender, uint256 amount) public returns (bool)',
  'function allowance(address owner, address spender) public view returns (uint256)',
];

class TokenService {
  constructor() {
    this.provider = new ethers.JsonRpcProvider(
      process.env.SEPOLIA_RPC_URL || 'https://sepolia.infura.io/v3/YOUR_INFURA_KEY'
    );
    if (
  this.privateKey &&
  this.privateKey.startsWith('0x') &&
  !this.privateKey.includes('tu_clave_privada')
) {
  this.signer = new ethers.Wallet(this.privateKey, this.provider);
} else {
  this.signer = null;
  console.log('[BLOCKCHAIN] Desactivado (sin PRIVATE_KEY válida)');
}
  }

  // Initialize token contract on blockchain
  async deployTokenContract(name, symbol, totalSupply) {
    try {
      if (!this.signer) {
        throw new Error('Signer not configured');
      }

      // Minimal ERC20 deployment would happen here
      // For now, we'll store contract metadata
      const token = new KronosToken({
        name,
        symbol,
        totalSupply: ethers.parseUnits(totalSupply.toString(), 18),
        network: 'sepolia',
      });

      await token.save();
      return token;
    } catch (error) {
      throw new Error(`Token deployment failed: ${error.message}`);
    }
  }

  // Get token balance for wallet
  async getBalance(userId) {
    try {
      const wallet = await UserWallet.findOne({ userId });
      if (!wallet) {
        return {
          tokenBalance: '0',
          stakedTokens: '0',
          unstakedTokens: '0',
          pendingRewards: '0',
        };
      }

      return {
        tokenBalance: wallet.tokenBalance.toString(),
        stakedTokens: wallet.stakedTokens.toString(),
        unstakedTokens: wallet.unstakedTokens.toString(),
        pendingRewards: wallet.pendingRewards.toString(),
        totalEarned: wallet.totalEarned.toString(),
      };
    } catch (error) {
      throw new Error(`Failed to get balance: ${error.message}`);
    }
  }

  // Transfer tokens between users
  async transferTokens(fromUserId, toUserId, amount) {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
      const fromWallet = await UserWallet.findOne({ userId: fromUserId }).session(session);
      const toWallet = await UserWallet.findOne({ userId: toUserId }).session(session);

      if (!fromWallet || !toWallet) {
        throw new Error('Wallet not found');
      }

      const transferAmountBI = ethers.parseUnits(amount.toString(), 18);
      const fromBalanceBI = ethers.parseUnits(fromWallet.tokenBalance.toString(), 18);

      if (fromBalanceBI < transferAmountBI) {
        throw new Error('Insufficient balance');
      }

      // Update balances
      fromWallet.tokenBalance = mongoose.Types.Decimal128.fromString(ethers.formatUnits(fromBalanceBI - transferAmountBI, 18));
      toWallet.tokenBalance = mongoose.Types.Decimal128.fromString(ethers.formatUnits(ethers.parseUnits(toWallet.tokenBalance.toString(), 18) + transferAmountBI, 18));

      await fromWallet.save({ session });
      await toWallet.save({ session });

      // Record transaction
      const transaction = new Transaction({
        fromWalletId: fromWallet._id,
        toWalletId: toWallet._id,        amount: mongoose.Types.Decimal128.fromString(amount.toString()),
        type: 'transfer',
        status: 'completed',
        description: `Transfer from ${fromUserId} to ${toUserId}`,
      });

      await transaction.save({ session });
      fromWallet.transactions.push(transaction._id);
      toWallet.transactions.push(transaction._id);

      await fromWallet.save({ session });
      await toWallet.save({ session });

      await session.commitTransaction();

      return transaction;
    } catch (error) {
      await session.abortTransaction();
      throw new Error(`Transfer failed: ${error.message}`);
    } finally {
      session.endSession();
    }
  }

  // Stake tokens
  async stakeTokens(userId, amount, lockPeriod) {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
      const wallet = await UserWallet.findOne({ userId }).session(session);
      if (!wallet) {
        throw new Error('Wallet not found');
      }

      const stakeAmountBI = ethers.parseUnits(amount.toString(), 18);
      const balanceBI = ethers.parseUnits(wallet.tokenBalance.toString(), 18);

      if (balanceBI < stakeAmountBI) {
        throw new Error('Insufficient balance to stake');
      }

      // Get APY for lock period
      const token = await KronosToken.findOne().session(session);
      const apy = token.stakingAPY.get(lockPeriod.toString()) || 5;

      // Calculate end date
      const startDate = new Date();
      const endDate = new Date(startDate.getTime() + lockPeriod * 24 * 60 * 60 * 1000);

      // Create stake
      const stake = new Stake({
        walletId: wallet._id,
        userId,
        amount: mongoose.Types.Decimal128.fromString(amount.toString()),
        lockPeriod,
        apy,
        startDate,
        endDate,
      });

      await stake.save({ session });

      // Update wallet
      wallet.tokenBalance = mongoose.Types.Decimal128.fromString(ethers.formatUnits(balanceBI - stakeAmountBI, 18));
      wallet.stakedTokens = mongoose.Types.Decimal128.fromString(ethers.formatUnits(ethers.parseUnits(wallet.stakedTokens.toString(), 18) + stakeAmountBI, 18));
      wallet.stakes.push(stake._id);

      await wallet.save({ session });

      // Record transaction
      const transaction = new Transaction({
        toWalletId: wallet._id,        amount: mongoose.Types.Decimal128.fromString(amount.toString()),
        type: 'stake',
        status: 'completed',
        description: `Stake ${lockPeriod} days at ${apy}% APY`,
        metadata: { stakeId: stake._id },
      });

      await transaction.save({ session });
      wallet.transactions.push(transaction._id);
      await wallet.save({ session });

      await session.commitTransaction();

      return stake;
    } catch (error) {
      await session.abortTransaction();
      throw new Error(`Staking failed: ${error.message}`);
    } finally {
      session.endSession();
    }
  }

  // Claim staking rewards
  async claimStakingRewards(userId, stakeId) {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
      const stake = await Stake.findOne({ _id: stakeId, userId }).session(session);
      if (!stake) {
        throw new Error('Stake not found');
      }

      if (stake.status !== 'active') {
        throw new Error('Stake is not active');
      }

      const now = new Date();
      if (now < stake.endDate) {
        throw new Error('Stake lock period not completed');
      }

      // Calculate rewards
      const principalBI = ethers.parseUnits(stake.amount.toString(), 18);
      // Use BigInt math for precision. Multiply by 10000 to handle decimals in APY.
      const rewardAmountBI = (principalBI * BigInt(stake.apy * 10000) * BigInt(stake.lockPeriod)) / BigInt(36500 * 10000);

      const wallet = await UserWallet.findOne({ _id: stake.walletId }).session(session);
      const currentBalanceBI = ethers.parseUnits(wallet.tokenBalance.toString(), 18);
      const currentStakedBI = ethers.parseUnits(wallet.stakedTokens.toString(), 18);
      const currentEarnedBI = ethers.parseUnits(wallet.totalEarned.toString(), 18);

      // Add rewards to wallet
      wallet.tokenBalance = mongoose.Types.Decimal128.fromString(ethers.formatUnits(currentBalanceBI + principalBI + rewardAmountBI, 18));
      wallet.stakedTokens = mongoose.Types.Decimal128.fromString(ethers.formatUnits(currentStakedBI - principalBI, 18));
      wallet.totalEarned = mongoose.Types.Decimal128.fromString(ethers.formatUnits(currentEarnedBI + rewardAmountBI, 18));

      stake.rewardsEarned = mongoose.Types.Decimal128.fromString(ethers.formatUnits(rewardAmountBI, 18));
      stake.status = 'completed';
      stake.claimedAt = now;

      await stake.save({ session });
      await wallet.save({ session });

      const totalClaimedBI = principalBI + rewardAmountBI;
      // Record transaction
      const transaction = new Transaction({
        toWalletId: wallet._id,        amount: mongoose.Types.Decimal128.fromString(ethers.formatUnits(totalClaimedBI, 18)),
        type: 'unstake',
        status: 'completed',
        description: `Unstake with ${stake.apy}% APY rewards`,
        metadata: { stakeId: stake._id },
      });

      await transaction.save({ session });
      wallet.transactions.push(transaction._id);
      await wallet.save({ session });

      await session.commitTransaction();

      return {
        principal: ethers.formatUnits(principalBI, 18),
        rewards: ethers.formatUnits(rewardAmountBI, 18),
        total: ethers.formatUnits(totalClaimedBI, 18),
      };
    } catch (error) {
      await session.abortTransaction();
      throw new Error(`Reward claim failed: ${error.message}`);
    } finally {
      session.endSession();
    }
  }

  // Process attention rewards
  async processAttentionRewards() {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      const unrewardedMetrics = await AttentionMetrics.find({
        isRewarded: false,
        createdAt: { $gte: today },
      }).session(session);

      if (unrewardedMetrics.length === 0) {
        return { processed: 0, totalRewarded: '0' };
      }

      // Group by creator
      const creatorMetrics = {};
      unrewardedMetrics.forEach((metric) => {
        if (!creatorMetrics[metric.creatorId]) {
          creatorMetrics[metric.creatorId] = {
            totalTimeSeconds: 0,
            metrics: [],
          };
        }
        creatorMetrics[metric.creatorId].totalTimeSeconds += metric.timeSpentSeconds;
        creatorMetrics[metric.creatorId].metrics.push(metric);
      });

      const token = await KronosToken.findOne().session(session);
      const totalRewardPool = parseFloat(token.dailyRewardPool.toString());
      const totalAttentionSeconds = Object.values(creatorMetrics).reduce(
        (sum, data) => sum + data.totalTimeSeconds,
        0
      );
      const tokensPerSecond = totalRewardPool / totalAttentionSeconds;

      let totalRewarded = 0;

      for (const [creatorId, data] of Object.entries(creatorMetrics)) {
        const creatorReward = data.totalTimeSeconds * tokensPerSecond;
        totalRewarded += creatorReward;

        // Update creator wallet
        const creatorWallet = await UserWallet.findOne({
          userId: creatorId,
        }).session(session);

        if (creatorWallet) {
          const currentPendingBI = ethers.parseUnits(creatorWallet.pendingRewards.toString(), 18);
          const currentEarnedBI = ethers.parseUnits(creatorWallet.totalEarned.toString(), 18);
          const rewardBI = ethers.parseUnits(creatorReward.toFixed(18), 18);

          creatorWallet.pendingRewards = mongoose.Types.Decimal128.fromString(ethers.formatUnits(currentPendingBI + rewardBI, 18));
          creatorWallet.totalEarned = mongoose.Types.Decimal128.fromString(ethers.formatUnits(currentEarnedBI + rewardBI, 18));

          await creatorWallet.save({ session });
        }

        // Mark metrics as rewarded
        for (const metric of data.metrics) {
          metric.isRewarded = true;          metric.tokensEarned = mongoose.Types.Decimal128.fromString((metric.timeSpentSeconds * tokensPerSecond).toFixed(18));
          metric.rewardDate = new Date();
          await metric.save({ session });
        }
      }

      await session.commitTransaction();

      return {
        processed: unrewardedMetrics.length,
        totalRewarded: totalRewarded.toString(),
        creatorsRewarded: Object.keys(creatorMetrics).length,
      };
    } catch (error) {
      await session.abortTransaction();
      throw new Error(`Attention reward processing failed: ${error.message}`);
    } finally {
      session.endSession();
    }
  }

  // Get leaderboard
  async getLeaderboard(type = 'earners', limit = 10) {
    try {
      let leaderboard;

      if (type === 'earners') {
        leaderboard = await UserWallet.find()
          .sort({ totalEarned: -1 })
          .limit(limit)
          .populate('userId', 'username email');
      } else if (type === 'stakers') {
        leaderboard = await UserWallet.find()
          .sort({ stakedTokens: -1 })
          .limit(limit)
          .populate('userId', 'username email');
      } else if (type === 'holders') {
        leaderboard = await UserWallet.find()
          .sort({ tokenBalance: -1 })
          .limit(limit)
          .populate('userId', 'username email');
      }

      return leaderboard.map((wallet, index) => ({
        rank: index + 1,
        userId: wallet.userId._id,
        username: wallet.userId.username,
        [type === 'earners' ? 'totalEarned' : type === 'stakers' ? 'stakedTokens' : 'tokenBalance']:
          wallet.totalEarned.toString(),
        tokenBalance: wallet.tokenBalance.toString(),
      }));
    } catch (error) {
      throw new Error(`Leaderboard fetch failed: ${error.message}`);
    }
  }

  // Track attention
  async trackAttention(userId, contentId, creatorId, timeSpentSeconds, sessionId) {
    try {
      const token = await KronosToken.findOne();
      const attentionRate = token.attentionRate; // tokens per minute

      const tokensEarned = (timeSpentSeconds / 60) * attentionRate;

      const metric = new AttentionMetrics({
        userId,
        contentId,
        creatorId,
        timeSpentSeconds,        tokensEarned: mongoose.Types.Decimal128.fromString(tokensEarned.toFixed(18)),
        sessionId,
      });

      await metric.save();

      return metric;
    } catch (error) {
      throw new Error(`Attention tracking failed: ${error.message}`);
    }
  }
}

module.exports = new TokenService();
