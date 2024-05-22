import { errorHandler } from "../utils/error.js";
import bcryptjs from "bcryptjs";
import User from "../models/user.model.js";

export const test = (req, res) => {
  res.json({ message: `this is test api` });
};

export const updateUser = async (req, res, next) => {
  if (req.user.id !== req.params.userId) {
    return next(errorHandler(403, "You are not allowed to update this user"));
  }
  if (req.body.password) {
    if (req.body.password.length < 6) {
      return errorHandler(
        400,
        "Passowd must be at least more then 6 characters"
      );
    }
    req.body.password = bcryptjs.hashSync(req.body.password, 10);
  }
  if (req.body.username) {
    if (req.body.username < 7 || req.body.username > 20) {
      return next(
        errorHandler(
          400,
          "The usename must the more then 7 and less then 20 characters"
        )
      );
    }
    if (req.body.username.includes(" ")) {
      return next(errorHandler(400, "Username cannot contain spaces"));
    }
    if (req.body.username !== req.body.username.toLowerCase()) {
      return next(errorHandler(400, "The username only contains Lowercases "));
    }
    if (!req.body.username.match(/^[a-zA-Z0-9]+$/)) {
      return next(
        errorHandler(
          400,
          "The username only contains the letter and number (not special charecters)"
        )
      );
    }
  }
  try {
    const updatedUser = await User.findByIdAndUpdate(
      req.params.userId,
      {
        $set: {
          username: req.body.username,
          password: req.body.password,
          email: req.body.email,
          profilePicture: req.body.profilePicture,
        },
      },
      { new: true }
    );
    const { password, ...rest } = updatedUser._doc;
    res.status(200).json(rest);
  } catch (error) {
    next(error);
  }
};

export const deleteUser = async (req, res, next) => {
  console.log(req);
  if (!req.user.isAdmin && req.user.id !== req.params.userId) {
    return next(errorHandler(400, "You not the allowed to delete this user"));
  }
  try {
    await User.findByIdAndDelete(req.params.userId);
    res.status(200).json("user has been deleted");
  } catch (error) {
    next(error);
  }
};

export const signoutuser = (req, res, next) => {
  try {
    res.clearCookie("access_token").status(200).json("signout successfully");
  } catch (error) {
    next(error);
  }
};

export const getUsers = async (req, res, next) => {
  if (!req.user.isAdmin) {
    return errorHandler(403, "you are not allowed to see all users");
  }
  try {
    const startIndex = parseInt(req.query.startIndex) || 0;
    const limit = parseInt(req.body.limit) || 10;
    const sortDirection = req.query.sort === "asc" ? 1 : -1;

    const users = await User.find()
      .sort({ createdAt: sortDirection })
      .limit({ limit })
      .skip({ startIndex });

    const userWithOutPassword = users.map((user) => {
      const { password, ...rest } = user._doc;
      return rest;
    });

    const totalUsers = await User.countDocuments();

    const now = new Date();

    const oneMonthAgo = new Date(
      now.getFullYear(),
      now.getMonth() - 1,
      now.getDate()
    );

    const lastMonthUser = await User.countDocuments({
      createdAt: { $gte: oneMonthAgo },
    });

    res.status(200).json({
      users: userWithOutPassword,
      totalUsers,
      lastMonthUser,
      oneMonthAgo,
    });
  } catch (error) {
    next(error);
  }
};

export const getUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.userId);
    const { password, ...rest } = user._doc;
    if (!user) {
      return next(errorHandler(403, "User not found"));
    }
    res.status(200).json(rest);
  } catch (error) {
    next(error);
  }
};
