import bcrypt from "bcryptjs";
import User from "../models/user.model.js";
import Listing from "../models/listing.model.js";
import { errorHandler } from "../utils/error.js";

export const test = (req, res) => {
  res.send("Test route being called!!!");
};

export const updateUser = async (req, res, next) => {
  if (req.user.id !== req.params.id)
    return next(errorHandler(401, "You can only update your own account!"));

  try {
    if (req.body.password) {
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
          idCard: req.body.idCard,
          passport: req.body.passport,
        },
      },
      {
        new: true,
      }
    );

    const { password, ...rest } = updatedUser._doc;
    res.status(200).json(rest);
  } catch (error) {
    return next(error);
  }
};

export const deleteUser = async (req, res, next) => {
  if (req.user.id !== req.params.id)
    return next(errorHandler(401, "You can only delete your own account!"));
  try {
    await User.findByIdAndDelete(req.params.id);
    res.clearCookie("access_token");
    res.status(200).json("User has been deleted...");
  } catch (error) {
    next(error);
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
