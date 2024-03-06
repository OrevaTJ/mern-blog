import bcryptjs from 'bcryptjs';
import { errorHandler } from '../utils/error.js';
import User from '../models/user.model.js';
import { getLastMonthDate } from '../utils/date.js';

export const updateUser = async (req, res, next) => {
  const { username, email, profilePhoto, password } = req.body;
  const { id: userId } = req.user;
  const { id: requestedUserId } = req.params;

  try {
    if (userId !== requestedUserId)
      return next(errorHandler(401, 'Update not allowed'));

    let hashedPassword;
    if (password) {
      if (password.length < 6)
        return next(
          errorHandler(400, 'Password must not be less than six characters')
        );
      hashedPassword = bcryptjs.hashSync(password, 10);
    }

    const updateObject = {
      $set: {
        username,
        email,
        password: hashedPassword,
        profilePhoto,
      },
    };
    const updatedUser = await User.findByIdAndUpdate(
      requestedUserId,
      updateObject,
      {
        new: true, // return updated document
        runValidators: true, // enforce validation rules specified in the model's schema
      }
    );

    const { password: updatedPassword, ...otherUserDetails } = updatedUser._doc;

    res.status(200).json(otherUserDetails);
  } catch (error) {
    next(error);
  }
};

export const deleteUser = async (req, res, next) => {
  const { id } = req.params;

  try {
    // Check if the request is coming from an admin
    if (req.user.isAdmin) {
      await User.findByIdAndDelete(id);
      res.status(200).json('Account deleted successfully');
    } else {
      // If the request is not from an admin, check if it's the user's own account being deleted
      if (req.user.id !== id) {
        return next(errorHandler(401, 'Not authorized'));
      }
    }

    // Proceed if it's the user's own account being deleted
    await User.findByIdAndDelete(req.params.id);
    res
      .clearCookie('user_token', { httpOnly: true })
      .status(200)
      .json('Account deleted successfully');
  } catch (error) {
    next(error);
  }
};

export const signout = (req, res, next) => {
  try {
    res
      .clearCookie('user_token', { httpOnly: true })
      .status(200)
      .json('Signed out successfully');
  } catch (error) {
    next(error);
  }
};

export const getUsers = async (req, res, next) => {
  if (!req.user.isAdmin) {
    return next(errorHandler(403, 'You are not allowed to see all users'));
  }

  try {
    const startIndex = parseInt(req.query.startIndex) || 0;
    const limit = parseInt(req.query.limit) || 9;
    const sortDirection = req.query.sort === 'asc' ? 1 : -1;

    const users = await User.find()
      .sort({ createdAt: sortDirection })
      .skip(startIndex)
      .limit(limit);

    // Remove users passwords
    const usersWithoutPassword = users.map((user) => {
      const { password: removePassword, ...otherUserDetails } = user._doc;
      return otherUserDetails;
    });

    // Get total users count
    const totalUsers = await User.countDocuments();

    // Get last month's users count
    const lastMonthUsers = await User.countDocuments({
      createdAt: { $gte: getLastMonthDate() },
    });

    res.status(200).json({
      users: usersWithoutPassword,
      totalUsers,
      lastMonthUsers,
    });
  } catch (error) {
    next(error);
  }
};
