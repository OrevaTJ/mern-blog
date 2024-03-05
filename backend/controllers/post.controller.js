import Post from '../models/post.model.js';
import { getLastMonthDate } from '../utils/date.js';
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
      userId: id,
    });

    const savedPost = await post.save();

    res.status(201).json(savedPost);
  } catch (error) {
    next(error);
  }
};

export const getPosts = async (req, res, next) => {
  const { order, userId, category, slug, postId, searchTerm } = req.query;

  try {
    // Parse query parameters
    const startIndex = parseInt(req.query.startIndex) || 0;
    const limit = parseInt(req.query.limit) || 9;
    const sortDirection = order === 'asc' ? 1 : -1;

    // Construct query criteria
    const query = {};
    if (userId) query.userId = userId;
    if (category) query.category = category;
    if (slug) query.slug = slug;
    if (postId) query._id = postId;
    if (searchTerm) {
      query.$or = [
        { title: { $regex: req.query.searchTerm, $options: 'i' } },
        { content: { $regex: req.query.searchTerm, $options: 'i' } },
      ];
    }

    // Query the database
    const posts = await Post.find(query)
      .sort({ updatedAt: sortDirection })
      .skip(startIndex)
      .limit(limit);

    // Get total posts count
    const totalPosts = await Post.countDocuments();

    // Get last month's posts count
    const lastMonthPosts = await Post.countDocuments({
      createdAt: { $gte: getLastMonthDate() },
    });

    // Send response
    res.status(200).json({
      posts,
      totalPosts,
      lastMonthPosts,
    });
  } catch (error) {
    next(error);
  }
};

export const deletePost = async (req, res, next) => {
    if (!req.user.isAdmin || req.user.id !== req.params.userId) {
      return next(errorHandler(403, 'Not allowed'));
    }
    try {
      await Post.findByIdAndDelete(req.params.postId);
      res.status(200).json('Post deleted successfully');
    } catch (error) {
      next(error);
    }
  };