const express = require('express');
const router = express.Router();
const ResearchPaper = require('../models/ResearchPaper');
const User = require('../models/User');
const { protect } = require('../middlewares/auth.middleware');

// Get all papers
router.get('/', async (req, res) => {
  try {
    const papers = await ResearchPaper.findAll({
      order: [['createdAt', 'DESC']],
      include: [{
        model: User,
        attributes: ['display_name', 'avatar_url']
      }]
    });
    res.json(papers);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create paper
router.post('/', protect, async (req, res) => {
  try {
    const { title, abstract, faculty, file_url, pages } = req.body;
    
    if (!title || !abstract || !faculty || !file_url) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const paper = await ResearchPaper.create({
      title,
      abstract,
      user_id: req.user.id,
      faculty,
      file_url,
      pages
    });
    
    res.status(201).json(paper);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
