const express = require('express');
const router = express.Router();
const passport = require('passport');
const jwt = require('jsonwebtoken');
const { getJwtSecret } = require('../config/secrets');

const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:8080';
const AUTH_COOKIE_OPTIONS = {
	httpOnly: true,
	secure: process.env.NODE_ENV === 'production',
	sameSite: 'lax',
	maxAge: 7 * 24 * 60 * 60 * 1000,
	path: '/',
};

// Google Auth
router.get(
	'/google',
	passport.authenticate('google', { scope: ['profile', 'email'] }),
);

router.get(
	'/google/callback',
	passport.authenticate('google', { failureRedirect: frontendUrl }),
	(req, res) => {
		const token = jwt.sign({ id: req.user.id }, getJwtSecret(), {
			expiresIn: '7d',
		});
		res.cookie('deraya_token', token, AUTH_COOKIE_OPTIONS);
		res.redirect(frontendUrl);
	},
);

// Microsoft Auth
router.get('/microsoft', passport.authenticate('microsoft'));

router.get(
	'/microsoft/callback',
	passport.authenticate('microsoft', { failureRedirect: frontendUrl }),
	(req, res) => {
		const token = jwt.sign({ id: req.user.id }, getJwtSecret(), {
			expiresIn: '7d',
		});
		res.cookie('deraya_token', token, AUTH_COOKIE_OPTIONS);
		res.redirect(frontendUrl);
	},
);

module.exports = router;
