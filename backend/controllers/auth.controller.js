import User from '../models/user.model.js';
import bcryptjs from 'bcryptjs';
import { errorHandler } from '../utils/error.js';
import jwt from 'jsonwebtoken';

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
      .cookie('blog_token', token, { httpOnly: true })
      .json(otherUserDetails);
  } catch (error) {
    next(error);
  }
};
