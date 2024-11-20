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

router.get("/all", getListings);
router.get("/get/:id", getListingById);
router.post("/create", verifyToken, createListing);
router.post("/update/:id", verifyToken, updateListing);
router.delete("/delete/:id", verifyToken, deleteListing);
router.get("/get", getListing);
router.get("/search", searchListing);

export default router;
