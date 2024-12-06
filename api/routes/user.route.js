import express from "express";
import {
  // User Controller Functions
  getUsers,
  getUserListings,
  getUserGallery,
  updateUser,
  deleteUser,
  updatePassword,
  test,
} from "../controllers/user.controllers.js";
import { verifyToken } from "../utils/verifyUser.js";

const router = express.Router();

// Testing route (for debugging purposes)
router.get("/test", test);

// ==========================================
// User Management Routes (Requires Authentication)
// ==========================================

// Get all users (Admin only)
router.get("/all", getUsers);

// Update user information
router.put("/update/:id", verifyToken, updateUser); // Use PUT for updating

// Delete a user
router.delete("/delete/:id", verifyToken, deleteUser); // Use DELETE for removing a user

// Update user password
router.put("/update-password/:id", verifyToken, updatePassword); // Use PUT for password update

// ==========================================
// User Profile Routes (Public Access)
// ==========================================

// Get listings for a specific user
router.get("/listings/:id", verifyToken, getUserListings);

// Get user gallery (e.g., images, media)
router.get("/gallery/:id", verifyToken, getUserGallery);

export default router;
