const express = require('express');
const router = express.Router();
const Course = require('../models/Course');
const { protect } = require('../middlewares/auth.middleware');

// Get all courses
router.get('/', async (req, res) => {
  try {
    const courses = await Course.findAll({
      order: [['createdAt', 'DESC']]
    });
    res.json(courses);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Enroll - for now just increments counter
router.post('/enroll/:id', protect, async (req, res) => {
  try {
    const course = await Course.findByPk(req.params.id);
    if (!course) return res.status(404).json({ error: 'Course not found' });
    
    course.enrolled_count += 1;
    await course.save();
    res.json({ message: 'Enrolled successfully', course });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
