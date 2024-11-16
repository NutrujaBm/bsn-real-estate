import Listing from "../models/listing.model.js";
import { errorHandler } from "../utils/error.js";

export const getListings = async (req, res, next) => {
  try {
    // ดึงข้อมูลทั้งหมดจาก Listing
    const listings = await Listing.find();
    res.status(200).json(listings);
  } catch (error) {
    next(error); // ถ้ามีข้อผิดพลาดก็ให้ส่งไปยัง error handler
  }
};

export const getListingById = async (req, res, next) => {
  try {
    const listing = await Listing.findById(req.params.id).populate(
      "userRef",
      "username avatar"
    );
    if (!listing) return next(errorHandler(404, "Listing not found!"));
    res.status(200).json(listing);
  } catch (error) {
    next(error);
  }
};

export const createListing = async (req, res, next) => {
  try {
    // คำนวณวันหมดอายุเป็น 14 วันหลังจากวันที่โพสต์ถูกสร้าง
    const expirationDate = new Date();
    expirationDate.setDate(expirationDate.getDate() + 14); // เพิ่ม 14 วัน

    // เพิ่ม expiresAt ลงในข้อมูลที่ส่งมาจาก req.body
    const listingData = {
      ...req.body,
      expiresAt: expirationDate, // ตั้งค่าฟิลด์ expiresAt โดยอัตโนมัติ
    };

    const listing = await Listing.create(listingData);
    return res.status(201).json(listing);
  } catch (error) {
    next(error);
  }
};

export const updateListing = async (req, res, next) => {
  const listing = await Listing.findById(req.params.id);
  if (!listing) return next(errorHandler(404, "Listing not found"));

  // ตรวจสอบว่าโพสต์หมดอายุหรือยัง
  if (listing.expiresAt < new Date()) {
    return next(
      errorHandler(400, "This listing has expired and cannot be updated")
    );
  }

  // ตรวจสอบสถานะที่อนุญาตให้เปลี่ยน
  const allowedStatuses = ["active", "completed", "closed"];
  if (req.body.status && !allowedStatuses.includes(req.body.status)) {
    return next(errorHandler(400, "Invalid status"));
  }

  // หากต้องการให้วันหมดอายุเลื่อนเมื่ออัปเดต
  const newExpirationDate = new Date();
  newExpirationDate.setDate(newExpirationDate.getDate() + 14); // เพิ่มวันหมดอายุใหม่

  // กำหนดค่าใหม่ให้กับ expiresAt
  req.body.expiresAt = newExpirationDate;

  if (req.user.id !== listing.userRef) {
    return next(errorHandler(403, "You can only update your own listings"));
  }

  try {
    const updatedListing = await Listing.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    res.status(200).json(updatedListing);
  } catch (error) {
    next(error);
  }
};

export const deleteListing = async (req, res, next) => {
  const listing = await Listing.findById(req.params.id);
  if (!listing) return next(errorHandler(404, "Listing not found"));

  // Check if the user is an admin or the owner of the listing
  if (req.user.role !== "admin" && req.user.id !== listing.userRef) {
    return next(
      errorHandler(
        403,
        "You can only delete your own listings or if you are an admin"
      )
    );
  }

  try {
    await Listing.findByIdAndDelete(req.params.id);
    res.status(200).json("Listing has been deleted!");
  } catch (error) {
    next(error);
  }
};
