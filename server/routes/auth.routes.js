const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Register endpoint
router.post('/register', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    // Check if user exists
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ error: 'User already exists' });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create user
    const newUser = await User.create({
      email,
      password: hashedPassword
    });

    // Generate token
    const token = jwt.sign({ id: newUser.id }, process.env.JWT_SECRET, { expiresIn: '7d' });

    res.status(201).json({ 
      token, 
      user: { id: newUser.id, email: newUser.email, display_name: newUser.display_name } 
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Login endpoint
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    // Check if user exists
    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(400).json({ error: 'Invalid credentials' });
    }

    // Validate password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ error: 'Invalid credentials' });
    }

    // Generate token
    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: '7d' });

    res.json({ 
      token, 
      user: { id: user.id, email: user.email, display_name: user.display_name } 
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
