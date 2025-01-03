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
    if (req.body.password && req.user.role !== "admin") {
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
    const { status } = req.query;
    try {
      const filter = status
        ? { userRef: req.params.id, status }
        : { userRef: req.params.id };

      // เพิ่ม populate เพื่อดึงข้อมูล username และ avatar จาก userRef
      const listings = await Listing.find(filter)
        .populate("userRef", "username avatar") // ดึงข้อมูล userRef โดยเฉพาะ
        .exec();

      res.status(200).json(listings);
    } catch (error) {
      next(error);
    }
  } else {
    return next(errorHandler(401, "You can only view your own listings!"));
  }
};

export const updatePassword = async (req, res, next) => {
  const { currentPassword, newPassword, confirmPassword } = req.body;

  // ตรวจสอบว่ารหัสผ่านใหม่และยืนยันรหัสผ่านตรงกัน
  if (newPassword !== confirmPassword) {
    return next(errorHandler(400, "รหัสผ่านใหม่และยืนยันรหัสผ่านไม่ตรงกัน"));
  }

  try {
    const user = await User.findById(req.user.id);

    if (!user) {
      return next(errorHandler(404, "ไม่พบผู้ใช้"));
    }

    // ตรวจสอบว่ารหัสผ่านปัจจุบันถูกต้องหรือไม่
    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      return next(errorHandler(400, "รหัสผ่านปัจจุบันไม่ถูกต้อง"));
    }

    // แฮชรหัสผ่านใหม่ก่อนที่จะบันทึก
    const hashedPassword = bcrypt.hashSync(newPassword, 10);

    // อัพเดตรหัสผ่าน
    user.password = hashedPassword;
    await user.save();

    res.status(200).json({ message: "อัพเดตรหัสผ่านสำเร็จ" });
  } catch (error) {
    return next(error);
  }
};

export const getUserGallery = async (req, res, next) => {
  const { status } = req.query;
  try {
    const filter = status
      ? { userRef: req.params.id, status }
      : { userRef: req.params.id };

    const listings = await Listing.find(filter)
      .populate("userRef", "username avatar aboutMe email phone lineId") // เพิ่ม email, phone, และ lineId ใน populate
      .exec();

    res.status(200).json(listings);
  } catch (error) {
    next(error);
  }
};
