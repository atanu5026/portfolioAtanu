const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const dotenv = require('dotenv');

// Load env vars
dotenv.config();

const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(cors({
  origin: true,
  credentials: true,
}));

// Basic route
app.get('/', (req, res) => {
  res.send('API is running...');
});

// Import Routes
const authRoutes = require('./routes/authRoutes');
const profileRoutes = require('./routes/profileRoutes');
const projectRoutes = require('./routes/projectRoutes');
const blogRoutes = require('./routes/blogRoutes');
const messageRoutes = require('./routes/messageRoutes');
const guestbookRoutes = require('./routes/guestbookRoutes');
const uploadRoutes = require('./routes/uploadRoutes');
const experienceRoutes = require('./routes/experienceRoutes');

// Use Routes
app.use('/api/auth', authRoutes);
app.use('/api/profile', profileRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/blogs', blogRoutes);
app.use('/api/messages', messageRoutes);
app.use('/api/guestbook', guestbookRoutes);
app.use('/api/upload', uploadRoutes);
app.use('/api/experience', experienceRoutes);

// Error Handler Middleware
// app.use(require('./middleware/errorMiddleware').errorHandler);

module.exports = app;
