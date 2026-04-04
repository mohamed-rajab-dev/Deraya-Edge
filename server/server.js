const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const session = require('express-session');
const path = require('path');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Passport (must be after dotenv)
const passport = require('./config/passport');
const sequelize = require('./models/index');

// Middleware
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:8080',
  credentials: true
}));
app.use(express.json());
app.use('/uploads', express.static('uploads'));
app.use(session({
  secret: process.env.JWT_SECRET || 'deraya_secret_key',
  resave: false,
  saveUninitialized: false,
  cookie: { secure: false }
}));
app.use(passport.initialize());
app.use(passport.session());

// DB Connection & Sync
sequelize.sync()
  .then(() => console.log('SQLite Database Synced Successfully'))
  .catch(err => console.error('Database Sync Error:', err));

// Routes
const authRoutes    = require('./routes/auth.routes');
const oauthRoutes   = require('./routes/oauth.routes');
const paperRoutes   = require('./routes/paper.routes');
const postRoutes    = require('./routes/post.routes');
const uploadRoutes  = require('./routes/upload.routes');
const articleRoutes = require('./routes/article.routes');
const courseRoutes  = require('./routes/course.routes');
const chatRoutes    = require('./routes/chat.routes');

app.use('/api/auth', authRoutes);
app.use('/api/auth', oauthRoutes);   // Google & Microsoft OAuth
app.use('/api/papers', paperRoutes);
app.use('/api/posts', postRoutes);
app.use('/api/upload', uploadRoutes);
app.use('/api/articles', articleRoutes);
app.use('/api/courses', courseRoutes);
app.use('/api/chat', chatRoutes);

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Deraya Backend API is running' });
});

// Serve Frontend in Production
// Assuming 'dist' is created in the root of the project
app.use(express.static(path.join(__dirname, '../dist')));

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../dist', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
