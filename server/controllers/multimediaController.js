const Post = require('../models/Post');
const User = require('../models/User');
const { handleUpload } = require('../utils/cloudinaryUploader');

exports.createMultimediaPost = async (req, res) => {
  try {
    const { content, visibility = 'public' } = req.body;
    const files = req.files || {};
    const postData = {
      author: req.user.id,
      content,
      visibility,
    };

    if (files.image) {
      const result = await handleUpload(files.image[0].buffer, 'image', 'super-app/images');
      postData.image = result.secure_url;
    }
    if (files.video) {
      const result = await handleUpload(files.video[0].buffer, 'video', 'super-app/videos');
      postData.video = result.secure_url;
    }
    if (files.music) {
      const result = await handleUpload(files.music[0].buffer, 'raw', 'super-app/music');
      postData.music = result.secure_url;
    }

    const post = new Post(postData);
    await post.save();
    await post.populate('author', 'username avatar firstName lastName');

    res.status(201).json({
      success: true,
      message: 'Post created successfully',
      post,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.uploadPostImage = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No image uploaded' });
    }
    const result = await handleUpload(req.file.buffer, 'image', 'super-app/images');
    res.status(200).json({
      success: true,
      imageUrl: result.secure_url,
      publicId: result.public_id,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.uploadPostVideo = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No video uploaded' });
    }
    const result = await handleUpload(req.file.buffer, 'video', 'super-app/videos');
    res.status(200).json({
      success: true,
      videoUrl: result.secure_url,
      duration: result.duration || null,
      publicId: result.public_id,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.uploadPostMusic = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No music uploaded' });
    }
    const result = await handleUpload(req.file.buffer, 'raw', 'super-app/music');
    res.status(200).json({
      success: true,
      musicUrl: result.secure_url,
      duration: result.duration || null,
      publicId: result.public_id,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getMediaPosts = async (req, res) => {
  try {
    const { type = 'all' } = req.query; // 'all', 'videos', 'music', 'images'
    const userId = req.user.id;

    const currentUser = await User.findById(userId);
    const followingIds = [...currentUser.following, userId];

    let filter = {
      author: { $in: followingIds },
      visibility: { $in: ['public', 'followers'] },
    };

    if (type === 'videos') {
      filter.video = { $exists: true, $ne: null };
    } else if (type === 'music') {
      filter.music = { $exists: true, $ne: null };
    } else if (type === 'images') {
      filter.image = { $exists: true, $ne: null };
    }

    const posts = await Post.find(filter)
      .populate('author', 'username avatar firstName lastName')
      .sort({ createdAt: -1 })
      .limit(50);

    res.status(200).json({
      success: true,
      type,
      count: posts.length,
      posts,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
