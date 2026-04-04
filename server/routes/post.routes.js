const express = require('express');
const router = express.Router();
const CommunityPost = require('../models/CommunityPost');
const User = require('../models/User');
const { protect } = require('../middlewares/auth.middleware');

// Get all posts
router.get('/', async (req, res) => {
  try {
    const posts = await CommunityPost.findAll({
      order: [['createdAt', 'DESC']],
      include: [{
        model: User,
        attributes: ['display_name', 'avatar_url']
      }]
    });
    res.json(posts);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create post
router.post('/', protect, async (req, res) => {
  try {
    const { content, faculty, image_url } = req.body;
    
    if (!content || !faculty) {
      return res.status(400).json({ error: 'Missing content or faculty' });
    }

    const post = await CommunityPost.create({
      user_id: req.user.id,
      content,
      faculty,
      image_url
    });
    
    res.status(201).json(post);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
