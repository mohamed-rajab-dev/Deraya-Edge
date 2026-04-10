const jwt = require('jsonwebtoken');
const { getJwtSecret } = require('../config/secrets');

function readCookieValue(cookieHeader, name) {
	if (!cookieHeader) return null;

	const cookies = cookieHeader.split(';');
	for (const cookie of cookies) {
		const [rawKey, ...rawValue] = cookie.trim().split('=');
		if (rawKey === name) {
			return decodeURIComponent(rawValue.join('='));
		}
	}

	return null;
}

const protect = (req, res, next) => {
	let token;
	if (
		req.headers.authorization &&
		req.headers.authorization.startsWith('Bearer')
	) {
		token = req.headers.authorization.split(' ')[1];
	}

	if (!token) {
		token = readCookieValue(req.headers.cookie, 'deraya_token');
	}

	if (!token) {
		return res.status(401).json({ error: 'Not authorized, no token' });
	}

	try {
		const decoded = jwt.verify(token, getJwtSecret());
		req.user = decoded;
		next();
	} catch (error) {
		res.status(401).json({ error: 'Not authorized, token failed' });
	}
};

module.exports = { protect };
