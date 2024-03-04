import Post from '../models/post.model.js';
import { errorHandler } from '../utils/error.js';

export const create = async (req, res, next) => {
  const { content, title } = req.body;
  const { id, isAdmin } = req.user;

  try {
    // Check if user is an admin
    if (!isAdmin) {
      return next(errorHandler(403, 'Not allowed'));
    }

    // Check if required fields are missing
    if (!title || !content) {
      return next(errorHandler(400, 'Some fields are missing'));
    }

    // Generate slug from title
    const slug = title
      .split(' ')
      .join('-')
      .toLowerCase()
      .replace(/[^a-zA-Z0-9-]/g, '');

    // Create post object
    const post = new Post({
      ...req.body,
      slug,
      userId: id
    });

    const savedPost = await post.save()

    res.status(201).json(savedPost);
  } catch (error) {
    next(error);
  }
};
