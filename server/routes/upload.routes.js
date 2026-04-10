const express = require('express');
const router = express.Router();
const multer = require('multer');
const fs = require('fs');
const path = require('path');
const { protect } = require('../middlewares/auth.middleware');

const uploadDirectory = path.join(process.cwd(), 'uploads');
const MAX_FILE_SIZE_BYTES = 10 * 1024 * 1024;
const ALLOWED_MIME_TYPES = new Set([
	'application/pdf',
	'application/msword',
	'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
	'image/jpeg',
	'image/png',
	'image/webp',
]);

fs.mkdirSync(uploadDirectory, { recursive: true });

// Multer storage config
const storage = multer.diskStorage({
	destination: function (req, file, cb) {
		cb(null, uploadDirectory);
	},
	filename: function (req, file, cb) {
		const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
		cb(
			null,
			file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname),
		);
	},
});

const upload = multer({
	storage: storage,
	limits: { fileSize: MAX_FILE_SIZE_BYTES },
	fileFilter: (req, file, cb) => {
		if (ALLOWED_MIME_TYPES.has(file.mimetype)) {
			cb(null, true);
			return;
		}

		cb(new Error('Unsupported file type'));
	},
});

// Single file upload
router.post('/', protect, (req, res) => {
	upload.single('file')(req, res, (error) => {
		if (error) {
			if (error.code === 'LIMIT_FILE_SIZE') {
				return res.status(413).json({ error: 'File is too large' });
			}

			return res.status(400).json({ error: error.message || 'Upload failed' });
		}

		if (!req.file) {
			return res.status(400).json({ error: 'No file uploaded' });
		}

		const fileUrl = `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`;
		res.json({ url: fileUrl });
	});
});

module.exports = router;
