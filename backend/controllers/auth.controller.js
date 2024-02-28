import User from '../models/user.model.js';
import bcryptjs from 'bcryptjs';
import { errorHandler } from '../utils/error.js';
import jwt from 'jsonwebtoken';
import generatePassword from '../utils/password.js';

export const signup = async (req, res, next) => {
  const { username, email, password } = req.body;
  const hashPassword = bcryptjs.hashSync(password, 10);

  const newUser = new User({ username, email, password: hashPassword });

  try {
    await newUser.save();
    res.json('Signup successful');
  } catch (error) {
    next(error);
  }
};

export const signin = async (req, res, next) => {
  const { email, password } = req.body;

  try {
    const validUser = await User.findOne({ email });
    if (!validUser) {
      return next(errorHandler(400, 'Email or Password incorrect'));
    }

    const validPassword = bcryptjs.compareSync(password, validUser.password);
    if (!validPassword) {
      return next(errorHandler(400, 'Email or Password incorrect'));
    }

    const token = jwt.sign({ id: validUser._id }, process.env.JWT_SECRET);

    // remove password from response to client
    const { password: removePassword, ...otherUserDetails } = validUser._doc;

    res
      .status(200)
      .cookie('user_token', token, { httpOnly: true })
      .json(otherUserDetails);
  } catch (error) {
    next(error);
  }
};

export const googleAuth = async (req, res, next) => {
  const { name, email, photoUrl } = req.body;

  try {
    // Check if the user with the provided email already exists in the database
    let user = await User.findOne({ email });

    if (!user) {
      const generatedPassword = generatePassword(16);
      const hashPassword = bcryptjs.hashSync(generatedPassword, 10);

      const username =
        name.split(' ').join('').toLowerCase() + generatePassword(4);

      // Create and save the new user to the database
      user = new User({
        username,
        email,
        password: hashPassword,
        profilePhoto: photoUrl,
      });
      await user.save();
    }
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);

    const { password: removePassword, ...otherUserDetails } = user._doc;

    res
      .cookie('user_token', token, { httpOnly: true })
      .status(200)
      .json(otherUserDetails);
  } catch (error) {
    next(error);
  }
}