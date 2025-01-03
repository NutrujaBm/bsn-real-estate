import User from "../models/user.model.js";
import bcryptjs from "bcryptjs";
import { errorHandler } from "../utils/error.js";
import jwt from "jsonwebtoken";

export const register = async (req, res, next) => {
  console.log(req.body);

  const { username, email, password } = req.body;

  const hashedPassword = bcryptjs.hashSync(password, 10);

  // สร้าง User object โดยการส่ง idCard และ passport ที่ได้จาก req.body
  const newUser = new User({
    username,
    email,
    password: hashedPassword,
  });

  try {
    await newUser.save();
    res.status(201).json("User created successfully");
  } catch (error) {
    next(error); // ส่งต่อ error
  }
};

export const login = async (req, res, next) => {
  const { email, password } = req.body;
  try {
    const validUser = await User.findOne({ email: email });
    if (!validUser) return next(errorHandler(404, "User not found"));

    const validPassword = bcryptjs.compareSync(password, validUser.password);
    if (!validPassword) return next(errorHandler(401, "Invalid credentials"));

    const token = jwt.sign({ id: validUser._id }, process.env.JWT_SECRET);
    const { password: pass, ...rest } = validUser._doc;

    res
      .cookie("access_token", token, { httpOnly: true })
      .status(200)
      .json(rest);
  } catch (error) {
    next(error);
  }
};

export const google = async (req, res, next) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    if (user) {
      const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
      const { password: pass, ...rest } = user._doc;
      res
        .cookie("access_token", token, { httpOnly: true })
        .status(200)
        .json(rest);
    } else {
      const generatedPassword =
        Math.random().toString(36).slice(-8) +
        Math.random().toString(36).slice(-8);
      const hashedPassword = bcryptjs.hashSync(generatedPassword, 10);
      const newUser = new User({
        username: req.body.name,
        email: req.body.email,
        password: hashedPassword,
        avatar: req.body.photo,
      });

      await newUser.save();
      const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET);
      const { password: pass, ...rest } = newUser._doc;
      res
        .cookie("access_token", token, { httpOnly: true })
        .status(200)
        .json(rest);
    }
  } catch (error) {
    next(error);
  }
};

export const logout = async (req, res, next) => {
  try {
    res.clearCookie("access_token");
    res.status(200).json("User has been logged out!");
  } catch (error) {
    next(error);
  }
};

export const refreshToken = async (req, res, next) => {
  const refreshToken = req.cookies.refresh_token; // หรือเก็บใน LocalStorage บนฝั่ง Frontend

  if (!refreshToken)
    return next(errorHandler(401, "No refresh token provided"));

  try {
    // ตรวจสอบว่า refresh token ถูกต้องหรือไม่
    const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);

    // หา user โดยใช้ ID ที่ได้จาก refresh token
    const user = await User.findById(decoded.id);
    if (!user) return next(errorHandler(404, "User not found"));

    // สร้าง Access Token ใหม่
    const newAccessToken = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    // ส่ง Access Token กลับไปให้ผู้ใช้
    res.cookie("access_token", newAccessToken, { httpOnly: true });
    res.status(200).json({ accessToken: newAccessToken });
  } catch (error) {
    next(error);
  }
};
