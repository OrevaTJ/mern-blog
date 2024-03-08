import Comment from '../models/comment.model.js';
import { getLastMonthDate } from '../utils/date.js';

export const create = async (req, res, next) => {
  try {
    const { content, postId, userId } = req.body;

    if (userId !== req.user.id) {
      return next(errorHandler(403, 'Sign in to create comment'));
    }

    const newComment = new Comment({
      content,
      postId,
      userId,
    });
    await newComment.save();

    res.status(200).json(newComment);
  } catch (error) {
    next(error);
  }
};

export const getComments = async (req, res, next) => {
  try {
    const comments = await Comment.find({ postId: req.params.postId }).sort({
      createdAt: -1,
    });
    res.status(200).json(comments);
  } catch (error) {
    next(error);
  }
};

export const likeComment = async (req, res, next) => {
  try {
    const comment = await Comment.findById(req.params.commentId);

    if (!comment) {
      return next(errorHandler(404, 'Comment not found'));
    }

    // Check if the user has already liked the comment
    const alreadyLikedIndex = comment.likes.indexOf(req.user.id);

    if (alreadyLikedIndex !== -1) {
      // User has already liked the comment, so unlike it
      comment.likes.splice(alreadyLikedIndex, 1);
      comment.numberOfLikes--;
    } else {
      // User hasn't liked the comment, so like it
      comment.likes.push(req.user.id); 
      comment.numberOfLikes++; 
    }

    await comment.save();
    res.status(200).json(comment);
  } catch (error) {
    next(error);
  }
};


export const editComment = async (req, res, next) => {
  try {
    const comment = await Comment.findById(req.params.commentId);

    if (!comment) {
      return next(errorHandler(404, 'Comment not found'));
    }

    if (comment.userId !== req.user.id && !req.user.isAdmin) {
      return next(
        errorHandler(403, 'You are not allowed to edit this comment')
      );
    }

    const editedComment = await Comment.findByIdAndUpdate(
      req.params.commentId,
      {
        content: req.body.content,
      },
      { new: true }
    );
    res.status(200).json(editedComment);
  } catch (error) {
    next(error);
  }
};

export const deleteComment = async (req, res, next) => {
  try {
    const comment = await Comment.findById(req.params.commentId);

    if (!comment) {
      return next(errorHandler(404, 'Comment not found'));
    }

    if (comment.userId !== req.user.id && !req.user.isAdmin) {
      return next(
        errorHandler(403, 'Cannot delete this comment')
      );
    }
    
    await Comment.findByIdAndDelete(req.params.commentId);
    res.status(200).json('Comment has been deleted');
  } catch (error) {
    next(error);
  }
};

export const getAllComments = async (req, res, next) => {
  const { sort } = req.query;

  if (!req.user.isAdmin)
  return next(errorHandler(403, 'Not allowed'));

  try {
    // Parse query parameters
    const startIndex = parseInt(req.query.startIndex) || 0;
    const limit = parseInt(req.query.limit) || 9;
    const sortDirection = sort === 'desc' ? 1 : -1;

    // Query the database
    const comments = await Comment.find()
      .sort({ createdAt: sortDirection })
      .skip(startIndex)
      .limit(limit);

    // Get total posts count
    const totalComments = await Comment.countDocuments();

    // Get last month's posts count
    const lastMonthComments = await Comment.countDocuments({
      createdAt: { $gte: getLastMonthDate() },
    });

    // Send response
    res.status(200).json({
      comments,
      totalComments,
      lastMonthComments,
    });
  } catch (error) {
    next(error);
  }
};