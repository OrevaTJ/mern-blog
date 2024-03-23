import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import userRoutes from './routes/user.route.js';
import authRoutes from './routes/auth.route.js';
import postRoutes from './routes/post.route.js';
import commentRoutes from './routes/comment.route.js';
import path from 'path';
import cron from 'node-cron';
import axios from 'axios'; // Import axios for making HTTP requests

// Load environment variables from .env file
dotenv.config();

// Define the port for the server to listen on, defaulting to 3001
const PORT = process.env.PORT || 3001;

// Connect to MongoDB database
mongoose
  .connect(process.env.MONGO)
  .then(() => {
    console.log('MongoDB connected');
  })
  .catch((error) => {
    console.error('MongoDB connection error:', error);
  });

// Resolve the current directory
const __dirname = path.resolve();

// Create an Express application
const app = express();

// Middleware to parse JSON bodies
app.use(express.json());

// Middleware to parse cookies
app.use(cookieParser());

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

// Define routes for user, authentication, posts, and comments
app.use('/api/user', userRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/post', postRoutes);
app.use('/api/comment', commentRoutes);

// Health check endpoint to verify server status
app.get('/health', (req, res) => {
  res.send('Server is running');
});

// Serve static files from the client/dist directory
app.use(express.static(path.join(__dirname, '/client/dist')));

// Route all other requests to the client-side application
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'client', 'dist', 'index.html'));
});

// Error handling middleware
app.use((error, req, res, next) => {
  const statusCode = error.statusCode || 500;
  const message = error.message || 'Internal server error';

  return res.status(statusCode).json({
    success: false,
    statusCode,
    message,
  });
});

// Define a cron job to run every 15 minutes
cron.schedule('*/15 * * * *', async () => {
  try {
    // Make an HTTP request to the health check endpoint
    const response = await axios.get('https://mern-blog-foq3.onrender.com/health');
    // Log the response data
    console.log('Health check response:', response.data);
  } catch (error) {
    // Log any errors that occur during the health check
    console.error('Error during health check:', error.message);
  }
});
