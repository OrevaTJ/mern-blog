import Comment from '../models/comment.model.js';

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
    const alreadyLikedIndex = comment.likes.findIndex(
      (like) => like.user.toString() === req.user.id
    );

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
