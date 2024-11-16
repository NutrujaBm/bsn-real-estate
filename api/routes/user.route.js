import express from "express";
import {
  deleteUser,
  getUserListings,
  getUsers,
  test,
  updateUser,
} from "../controllers/user.controllers.js";
import { verifyToken } from "../utils/verifyUser.js";

const router = express.Router();

router.get("/test", test);

// ใช้ verifyToken และ isAdmin
router.get("/all", getUsers);
router.post("/update/:id", verifyToken, updateUser);
router.delete("/delete/:id", verifyToken, deleteUser);

// เส้นทางนี้ใช้สำหรับผู้ใช้แต่ละคน
router.get("/listings/:id", verifyToken, getUserListings);

export default router;
