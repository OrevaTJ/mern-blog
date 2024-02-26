import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import userRoutes from './routes/user.route.js'
import authRoutes from './routes/auth.route.js'

dotenv.config();

mongoose
  .connect(process.env.MONGO)
  .then(() => {
    console.log('db connected');
  })
  .catch((error) => {
    console.log(error);
  });

const app = express();

app.use(express.json())

app.listen(3001, () => {
  console.log('Server running on port 3001');
});

app.use('/api/user', userRoutes)
app.use('/api/auth', authRoutes)

app.use((error, req, res, next) => {
    const statusCode = error.statusCode || 500;
    const message = error.message || 'Internal server error';
  
    return res.status(statusCode).json({
      success: false,
      statusCode,
      message,
    });
  });
