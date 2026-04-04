const express = require('express');
const router = express.Router();
const passport = require('passport');
const jwt = require('jsonwebtoken');

// Google Auth
router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

router.get('/google/callback', 
  passport.authenticate('google', { failureRedirect: '/login' }),
  (req, res) => {
    const token = jwt.sign({ id: req.user.id }, process.env.JWT_SECRET, { expiresIn: '7d' });
    const user = JSON.stringify({ 
      id: req.user.id, 
      email: req.user.email, 
      display_name: req.user.display_name,
      role: req.user.role 
    });
    // Redirect back to frontend with token
    res.redirect(`${process.env.FRONTEND_URL || 'http://localhost:8080'}?token=${token}&user=${encodeURIComponent(user)}`);
  }
);

// Microsoft Auth
router.get('/microsoft', passport.authenticate('microsoft'));

router.get('/microsoft/callback', 
  passport.authenticate('microsoft', { failureRedirect: '/login' }),
  (req, res) => {
    const token = jwt.sign({ id: req.user.id }, process.env.JWT_SECRET, { expiresIn: '7d' });
    const user = JSON.stringify({ 
      id: req.user.id, 
      email: req.user.email, 
      display_name: req.user.display_name,
      role: req.user.role 
    });
    // Redirect back to frontend with token
    res.redirect(`${process.env.FRONTEND_URL || 'http://localhost:8080'}?token=${token}&user=${encodeURIComponent(user)}`);
  }
);

module.exports = router;
