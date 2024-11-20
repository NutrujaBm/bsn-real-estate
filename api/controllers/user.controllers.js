import bcrypt from "bcryptjs";
import User from "../models/user.model.js";
import Listing from "../models/listing.model.js";
import { errorHandler } from "../utils/error.js";

export const test = (req, res) => {
  res.send("Test route being called!!!");
};

// Get all users
export const getUsers = async (req, res, next) => {
  try {
    const users = await User.find();
    res.status(200).json(users);
  } catch (error) {
    return next(error);
  }
};

// Get user by ID
export const getUserById = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return next(errorHandler(404, "User not found"));
    }
    res.status(200).json(user);
  } catch (error) {
    return next(error);
  }
};

export const updateUser = async (req, res, next) => {
  if (req.user.id !== req.params.id && req.user.role !== "admin") {
    return next(
      errorHandler(403, "You can only update your own account or be an admin")
    );
  }

  try {
    if (req.body.password) {
      const user = await User.findById(req.params.id);
      const isOldPasswordValid = await bcrypt.compare(
        req.body.oldPassword,
        user.password
      );

      if (!isOldPasswordValid) {
        return next(errorHandler(400, "Old password is incorrect"));
      }

      req.body.password = bcrypt.hashSync(req.body.password, 10);
    }

    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      {
        $set: {
          avatar: req.body.avatar,
          username: req.body.username,
          firstName: req.body.firstName,
          lastName: req.body.lastName,
          aboutMe: req.body.aboutMe,
          phone: req.body.phone,
          lineId: req.body.lineId,
          address: req.body.address,
          password: req.body.password,
          role: req.body.role,
        },
      },
      { new: true }
    );

    const { password, ...rest } = updatedUser._doc;
    res.status(200).json(rest);
  } catch (error) {
    return next(error);
  }
};

export const deleteUser = async (req, res, next) => {
  if (req.user.id !== req.params.id && req.user.role !== "admin") {
    return next(
      errorHandler(403, "You can only delete your own account or be an admin")
    );
  }

  try {
    await User.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "User has been deleted." });
  } catch (error) {
    return next(error);
  }
};

export const getUserListings = async (req, res, next) => {
  if (req.user.id === req.params.id) {
    const { status } = req.query; // Get the status filter from query params

    try {
      const filter = status
        ? { userRef: req.params.id, status }
        : { userRef: req.params.id };
      const listings = await Listing.find(filter); // Apply status filter if provided
      res.status(200).json(listings);
    } catch (error) {
      next(error);
    }
  } else {
    return next(errorHandler(401, "You can only view your own listings!"));
  }
};

export const updatePassword = async (req, res, next) => {
  try {
    // Check if the user is authorized to update their password
    if (req.user.id !== req.params.id && req.user.role !== "admin") {
      return res
        .status(403)
        .json({ message: "Unauthorized to update password" });
    }

    // Find the user and check if the old password is correct
    const user = await User.findById(req.user.id);
    const isOldPasswordValid = await bcrypt.compare(
      req.body.oldPassword,
      user.password
    );

    if (!isOldPasswordValid) {
      return res.status(400).json({ message: "Old password is incorrect" });
    }

    // Hash the new password
    const hashedPassword = bcrypt.hashSync(req.body.password, 10);
    user.password = hashedPassword;
    await user.save();

    res
      .status(200)
      .json({ success: true, message: "Password updated successfully" });
  } catch (error) {
    next(error);
  }
};
