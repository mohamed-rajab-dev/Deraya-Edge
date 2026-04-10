const crypto = require('crypto');

let developmentJwtSecret;

function getJwtSecret() {
	if (process.env.JWT_SECRET) {
		return process.env.JWT_SECRET;
	}

	if (process.env.NODE_ENV === 'production') {
		throw new Error('JWT_SECRET is required in production');
	}

	if (!developmentJwtSecret) {
		developmentJwtSecret = crypto.randomBytes(32).toString('hex');
	}

	return developmentJwtSecret;
}

function getSessionSecret() {
	return process.env.SESSION_SECRET || getJwtSecret();
}

module.exports = {
	getJwtSecret,
	getSessionSecret,
};
