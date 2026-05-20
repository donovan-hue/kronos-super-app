const GroupConversation = require('../models/GroupConversation');
const GroupMessage = require('../models/GroupMessage');

exports.createGroup = async (req, res) => {
  try {
    const { name, description, memberIds } = req.body;
    if (!name) return res.status(400).json({ success: false, message: 'Name required' });

    const members = [...new Set([req.user._id.toString(), ...(memberIds || [])])];
    const group = await GroupConversation.create({
      name,
      description: description || '',
      creator: req.user._id,
      members,
      admins: [req.user._id]
    });

    await group.populate('members', 'username firstName lastName avatar');
    res.status(201).json({ success: true, data: group });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.getMyGroups = async (req, res) => {
  try {
    const groups = await GroupConversation.find({ members: req.user._id })
      .populate('members', 'username firstName lastName avatar')
      .populate('lastMessage.author', 'username firstName lastName')
      .sort({ updatedAt: -1 });
    res.json({ success: true, data: groups });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.getGroupMessages = async (req, res) => {
  try {
    const group = await GroupConversation.findById(req.params.id);
    if (!group) return res.status(404).json({ success: false, message: 'Group not found' });

    const isMember = group.members.some(m => m.toString() === req.user._id.toString());
    if (!isMember) return res.status(403).json({ success: false, message: 'Not a member' });

    const { page = 1, limit = 50 } = req.query;
    const messages = await GroupMessage.find({ group: req.params.id })
      .populate('author', 'username firstName lastName avatar')
      .sort({ createdAt: 1 })
      .skip((page - 1) * limit)
      .limit(Number(limit));

    res.json({ success: true, data: messages });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.sendMessage = async (req, res) => {
  try {
    const { content } = req.body;
    if (!content?.trim()) return res.status(400).json({ success: false, message: 'Content required' });

    const group = await GroupConversation.findById(req.params.id);
    if (!group) return res.status(404).json({ success: false, message: 'Group not found' });

    const isMember = group.members.some(m => m.toString() === req.user._id.toString());
    if (!isMember) return res.status(403).json({ success: false, message: 'Not a member' });

    const message = await GroupMessage.create({
      group: req.params.id,
      author: req.user._id,
      content: content.trim()
    });

    group.lastMessage = { content: content.trim(), author: req.user._id, at: new Date() };
    group.updatedAt = new Date();
    await group.save();

    await message.populate('author', 'username firstName lastName avatar');
    res.status(201).json({ success: true, data: message });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.addMembers = async (req, res) => {
  try {
    const { memberIds } = req.body;
    const group = await GroupConversation.findById(req.params.id);
    if (!group) return res.status(404).json({ success: false, message: 'Group not found' });

    const isAdmin = group.admins.some(a => a.toString() === req.user._id.toString());
    if (!isAdmin) return res.status(403).json({ success: false, message: 'Not an admin' });

    for (const id of memberIds || []) {
      if (!group.members.some(m => m.toString() === id)) {
        group.members.push(id);
      }
    }
    await group.save();
    await group.populate('members', 'username firstName lastName avatar');
    res.json({ success: true, data: group });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.leaveGroup = async (req, res) => {
  try {
    const group = await GroupConversation.findById(req.params.id);
    if (!group) return res.status(404).json({ success: false, message: 'Group not found' });

    group.members = group.members.filter(m => m.toString() !== req.user._id.toString());
    group.admins = group.admins.filter(a => a.toString() !== req.user._id.toString());
    await group.save();
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.getGroupInfo = async (req, res) => {
  try {
    const group = await GroupConversation.findById(req.params.id)
      .populate('members', 'username firstName lastName avatar')
      .populate('admins', 'username firstName lastName avatar')
      .populate('creator', 'username firstName lastName avatar');
    if (!group) return res.status(404).json({ success: false, message: 'Not found' });
    res.json({ success: true, data: group });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
