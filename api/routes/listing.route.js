import express from "express";
import { verifyToken } from "../utils/verifyUser.js";
import {
  createListing,
  deleteListing,
  getListingById,
  getListings,
  updateListing,
  getListing,
  searchListing,
} from "../controllers/listing.controller.js";

const router = express.Router();

// ============================
// GET requests
// ============================
router.get("/all", getListings); // Get all listings
router.get("/get/:id", getListingById); // Get a specific listing by ID
router.get("/get", getListing); // Get a filtered or default listing
router.get("/search", searchListing); // Search for listings

// ============================
// POST requests
// ============================
router.post("/create", verifyToken, createListing); // Create a new listing

// ============================
// PUT requests
// ============================
router.put("/update/:id", verifyToken, updateListing); // Update an existing listing

// ============================
// DELETE requests
// ============================
router.delete("/delete/:id", verifyToken, deleteListing); // Delete a listing by ID

export default router;
