const Community = require('../models/Community');

// ─── Helpers ─────────────────────────────────────────────────────────────────

function getMemberEntry(community, userId) {
  return community.members.find(m => m.user.toString() === userId.toString());
}

function isMemberOf(community, userId) {
  return !!getMemberEntry(community, userId);
}

function getRoleOf(community, userId) {
  return getMemberEntry(community, userId)?.role || null;
}

function hasModPower(community, userId) {
  const role = getRoleOf(community, userId);
  return role === 'admin' || role === 'mod';
}

// ─── Controllers ─────────────────────────────────────────────────────────────

exports.createCommunity = async (req, res) => {
  try {
    const { name, description, privacy, category, rules, tags } = req.body;
    if (!name) return res.status(400).json({ success: false, message: 'Name required' });

    const community = await Community.create({
      name,
      description,
      privacy: privacy || 'public',
      category: category || 'other',
      rules: rules || [],
      tags: tags || [],
      creator: req.user._id,
      members: [{ user: req.user._id, role: 'admin' }],
    });

    await community.populate('creator', 'username firstName lastName avatar');
    res.status(201).json({ success: true, data: community });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.getCommunities = async (req, res) => {
  try {
    const { category, search, page = 1, limit = 20 } = req.query;
    const filter = { privacy: 'public' };
    if (category) filter.category = category;
    if (search) filter.$text = { $search: search };

    const skip = (page - 1) * limit;
    const communities = await Community.find(filter)
      .populate('creator', 'username firstName lastName avatar')
      .populate('members.user', 'username firstName lastName avatar')
      .select('-posts')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(Number(limit));

    const total = await Community.countDocuments(filter);
    res.json({ success: true, data: communities, total, page: Number(page) });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.getCommunity = async (req, res) => {
  try {
    const community = await Community.findById(req.params.id)
      .populate('creator', 'username firstName lastName avatar')
      .populate('members.user', 'username firstName lastName avatar')
      .populate('posts.author', 'username firstName lastName avatar')
      .populate('posts.comments.author', 'username firstName lastName avatar');

    if (!community) return res.status(404).json({ success: false, message: 'Community not found' });
    res.json({ success: true, data: community });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.joinCommunity = async (req, res) => {
  try {
    const community = await Community.findById(req.params.id);
    if (!community) return res.status(404).json({ success: false, message: 'Community not found' });

    const alreadyMember = isMemberOf(community, req.user._id);
    if (alreadyMember) {
      // Leave — admins cannot leave (they must transfer ownership first)
      if (getRoleOf(community, req.user._id) === 'admin' && community.members.length > 1) {
        return res.status(400).json({ success: false, message: 'El admin debe transferir ownership antes de salir' });
      }
      community.members = community.members.filter(m => m.user.toString() !== req.user._id.toString());
    } else {
      community.members.push({ user: req.user._id, role: 'member' });
    }

    await community.save();
    res.json({ success: true, isMember: !alreadyMember, memberCount: community.members.length });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.assignRole = async (req, res) => {
  try {
    const { targetUserId, role } = req.body;
    if (!['mod', 'member'].includes(role)) {
      return res.status(400).json({ success: false, message: 'Role must be mod or member' });
    }

    const community = await Community.findById(req.params.id);
    if (!community) return res.status(404).json({ success: false, message: 'Community not found' });

    // Only admins can assign roles
    if (getRoleOf(community, req.user._id) !== 'admin') {
      return res.status(403).json({ success: false, message: 'Solo el admin puede asignar roles' });
    }

    const target = getMemberEntry(community, targetUserId);
    if (!target) return res.status(404).json({ success: false, message: 'El usuario no es miembro' });
    if (target.role === 'admin') return res.status(400).json({ success: false, message: 'No puedes cambiar el rol del admin' });

    target.role = role;
    await community.save();
    res.json({ success: true, message: `Rol actualizado a ${role}` });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.createPost = async (req, res) => {
  try {
    const { content } = req.body;
    if (!content) return res.status(400).json({ success: false, message: 'Content required' });

    const community = await Community.findById(req.params.id);
    if (!community) return res.status(404).json({ success: false, message: 'Community not found' });

    if (community.privacy === 'private' && !isMemberOf(community, req.user._id)) {
      return res.status(403).json({ success: false, message: 'Join community to post' });
    }

    community.posts.unshift({ author: req.user._id, content });
    await community.save();

    const updated = await Community.findById(req.params.id)
      .populate('posts.author', 'username firstName lastName avatar');

    res.status(201).json({ success: true, data: updated.posts[0] });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.deletePost = async (req, res) => {
  try {
    const community = await Community.findById(req.params.id);
    if (!community) return res.status(404).json({ success: false, message: 'Not found' });

    const post = community.posts.id(req.params.postId);
    if (!post) return res.status(404).json({ success: false, message: 'Post not found' });

    const isAuthor = post.author.toString() === req.user._id.toString();
    const canMod = hasModPower(community, req.user._id);

    if (!isAuthor && !canMod) {
      return res.status(403).json({ success: false, message: 'Sin permisos para eliminar este post' });
    }

    post.deleteOne();
    await community.save();
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.likePost = async (req, res) => {
  try {
    const community = await Community.findById(req.params.id);
    if (!community) return res.status(404).json({ success: false, message: 'Not found' });

    const post = community.posts.id(req.params.postId);
    if (!post) return res.status(404).json({ success: false, message: 'Post not found' });

    const liked = post.likes.some(l => l.toString() === req.user._id.toString());
    if (liked) {
      post.likes = post.likes.filter(l => l.toString() !== req.user._id.toString());
    } else {
      post.likes.push(req.user._id);
    }

    await community.save();
    res.json({ success: true, likes: post.likes.length, liked: !liked });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.commentPost = async (req, res) => {
  try {
    const { text } = req.body;
    if (!text) return res.status(400).json({ success: false, message: 'Text required' });

    const community = await Community.findById(req.params.id);
    if (!community) return res.status(404).json({ success: false, message: 'Not found' });

    const post = community.posts.id(req.params.postId);
    if (!post) return res.status(404).json({ success: false, message: 'Post not found' });

    post.comments.push({ author: req.user._id, text });
    await community.save();

    res.status(201).json({ success: true, comment: post.comments[post.comments.length - 1] });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.getMyCommunitiesController = async (req, res) => {
  try {
    const communities = await Community.find({ 'members.user': req.user._id })
      .populate('creator', 'username firstName lastName avatar')
      .populate('members.user', 'username firstName lastName avatar')
      .select('-posts')
      .sort({ updatedAt: -1 });
    res.json({ success: true, data: communities });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
