import { errorHandler } from './error.js';
import jwt from 'jsonwebtoken';

export const verifyToken = (req, res, next) => {
  try {
    const token = req.cookies.user_token;

    if (!token) return next(errorHandler(401, 'Unauthorized'));

    const user = jwt.verify(token, process.env.JWT_SECRET);

    // add user id as user to req, use in verifying user all through
    req.user = user;
    next();
  } catch (error) {
    next(errorHandler(403, error.message));
  }
};
