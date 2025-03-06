import { Request, Response, NextFunction } from 'express';
import bcrypt from 'bcryptjs';

import { User } from '../models/db-schemas/user.schema';
import { HttpError } from '../models/custom/http-error';

export const getUsers = async (
  _req: Request,
  res: Response,
  next: NextFunction
) => {
  let users;

  try {
    users = await User.find({}, '-password');
  } catch (_error) {
    return next(new HttpError('Fetching users failed, please try again', 500));
  }

  res.json({ users: users.map((user) => user.toObject({ getters: true })) });
};

export const signup = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { username, email, password, image } = req.body;

  const existingUser = await User.findOne({
    $or: [{ email }, { username }],
  });

  if (existingUser) {
    return next(
      new HttpError('User with this email or username already exists', 422)
    );
  }

  let hashedPassword;
  try {
    hashedPassword = await bcrypt.hash(password, 12);
  } catch (_error) {
    return next(new HttpError('Could not create user, please try again', 500));
  }

  const user = new User({
    username,
    email,
    password: hashedPassword,
    image,
  });

  try {
    await user.save();
  } catch (_error) {
    return next(new HttpError('Signing up failed, please try again', 500));
  }

  res.status(201).json({ user: user.toObject({ getters: true }) });
};
