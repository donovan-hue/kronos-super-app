const EphemeralStory = require('../models/EphemeralStory');
const User = require('../models/User');
const cloudinary = require('cloudinary').v2;
const multer = require('multer');
const { CloudinaryStorage } = require('multer-storage-cloudinary');

const storage = new CloudinaryStorage({
  cloudinary,
  params: { folder: 'kronos/stories', allowed_formats: ['jpg', 'png', 'gif', 'webp', 'mp4', 'mov'] }
});
const upload = multer({ storage, limits: { fileSize: 50 * 1024 * 1024 } });

exports.uploadMiddleware = upload.single('media');

exports.createStory = async (req, res) => {
  try {
    const { text, bgColor, mediaType } = req.body;
    const storyData = {
      author: req.user._id,
      text: text || '',
      bgColor: bgColor || '#7c3aed',
      mediaType: mediaType || 'text'
    };

    if (req.file) {
      storyData.mediaUrl = req.file.path;
      storyData.mediaType = req.file.mimetype.startsWith('video') ? 'video' : 'image';
    }

    const story = await EphemeralStory.create(storyData);
    await story.populate('author', 'username firstName lastName avatar');
    res.status(201).json({ success: true, data: story });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.getActiveStories = async (req, res) => {
  try {
    const currentUser = await User.findById(req.user._id).select('following');
    const followingIds = currentUser.following || [];
    const authorIds = [...followingIds, req.user._id];

    const now = new Date();
    const stories = await EphemeralStory.find({
      author: { $in: authorIds },
      expiresAt: { $gt: now }
    })
      .populate('author', 'username firstName lastName avatar')
      .sort({ createdAt: -1 })
      .lean();

    // Group by author
    const grouped = {};
    for (const s of stories) {
      const uid = s.author._id.toString();
      if (!grouped[uid]) {
        grouped[uid] = { author: s.author, stories: [], hasUnviewed: false };
      }
      const viewed = s.viewers.some(v => v.user?.toString() === req.user._id.toString());
      grouped[uid].stories.push({ ...s, viewed });
      if (!viewed) grouped[uid].hasUnviewed = true;
    }

    res.json({ success: true, data: Object.values(grouped) });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.viewStory = async (req, res) => {
  try {
    const story = await EphemeralStory.findById(req.params.id);
    if (!story) return res.status(404).json({ success: false, message: 'Story not found' });

    const alreadyViewed = story.viewers.some(v => v.user?.toString() === req.user._id.toString());
    if (!alreadyViewed) {
      story.viewers.push({ user: req.user._id });
      await story.save();
    }

    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.deleteStory = async (req, res) => {
  try {
    const story = await EphemeralStory.findById(req.params.id);
    if (!story) return res.status(404).json({ success: false, message: 'Story not found' });
    if (story.author.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }
    await story.deleteOne();
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.getMyStories = async (req, res) => {
  try {
    const stories = await EphemeralStory.find({
      author: req.user._id,
      expiresAt: { $gt: new Date() }
    }).sort({ createdAt: -1 });
    res.json({ success: true, data: stories });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
