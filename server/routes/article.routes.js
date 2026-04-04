const express = require('express');
const router = express.Router();
const Article = require('../models/Article');
const User = require('../models/User');
const { protect } = require('../middlewares/auth.middleware');

// Get all articles
router.get('/', async (req, res) => {
  try {
    const articles = await Article.findAll({
      order: [['createdAt', 'DESC']],
      include: [{
        model: User,
        attributes: ['display_name', 'avatar_url']
      }]
    });
    res.json(articles);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create article
router.post('/', protect, async (req, res) => {
  try {
    const { title, content, faculty, read_time, tags } = req.body;
    
    const article = await Article.create({
      title,
      content,
      user_id: req.user.id,
      faculty,
      read_time,
      tags
    });
    
    res.status(201).json(article);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
