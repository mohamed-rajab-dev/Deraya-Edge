const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { getJwtSecret } = require('../config/secrets');

const AUTH_COOKIE_OPTIONS = {
	httpOnly: true,
	secure: process.env.NODE_ENV === 'production',
	sameSite: 'lax',
	maxAge: 7 * 24 * 60 * 60 * 1000,
	path: '/',
};

function normalizeEmail(email) {
	return String(email || '')
		.trim()
		.toLowerCase();
}

function isValidEmail(email) {
	return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function buildUserResponse(user) {
	return {
		id: user.id,
		email: user.email,
		display_name: user.display_name,
		role: user.role,
	};
}

function issueAuthToken(res, user) {
	const token = jwt.sign({ id: user.id }, getJwtSecret(), { expiresIn: '7d' });
	res.cookie('deraya_token', token, AUTH_COOKIE_OPTIONS);
	return token;
}

// Register endpoint
router.post('/register', async (req, res) => {
	try {
		const email = normalizeEmail(req.body.email);
		const password = String(req.body.password || '');

		if (!email || !password) {
			return res.status(400).json({ error: 'Email and password are required' });
		}

		if (!isValidEmail(email)) {
			return res
				.status(400)
				.json({ error: 'Please provide a valid email address' });
		}

		if (password.length < 6) {
			return res
				.status(400)
				.json({ error: 'Password must be at least 6 characters long' });
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
			password: hashedPassword,
		});

		// Generate token
		const token = issueAuthToken(res, newUser);

		res.status(201).json({
			token,
			user: buildUserResponse(newUser),
		});
	} catch (error) {
		res.status(500).json({ error: error.message });
	}
});

// Login endpoint
router.post('/login', async (req, res) => {
	try {
		const email = normalizeEmail(req.body.email);
		const password = String(req.body.password || '');

		if (!email || !password) {
			return res.status(400).json({ error: 'Email and password are required' });
		}

		if (!isValidEmail(email)) {
			return res
				.status(400)
				.json({ error: 'Please provide a valid email address' });
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
		const token = issueAuthToken(res, user);

		res.json({
			token,
			user: buildUserResponse(user),
		});
	} catch (error) {
		res.status(500).json({ error: error.message });
	}
});

module.exports = router;
