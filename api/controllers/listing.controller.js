import Listing from "../models/listing.model.js";
import { errorHandler } from "../utils/error.js";

export const getListings = async (req, res, next) => {
  try {
    // ดึงข้อมูลทั้งหมดจาก Listing พร้อม populate userRef
    const listings = await Listing.find().populate(
      "userRef",
      "username avatar"
    );
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

    // เพิ่ม expiryAt ลงในข้อมูลที่ส่งมาจาก req.body
    const listingData = {
      ...req.body,
      expiryAt: expirationDate, // ตั้งค่าฟิลด์ expiryAt โดยอัตโนมัติ
    };

    const listing = await Listing.create(listingData);
    return res.status(201).json(listing);
  } catch (error) {
    next(error);
  }
};

export const updateListing = async (req, res, next) => {
  try {
    // ค้นหาโพสต์ในฐานข้อมูล
    const listing = await Listing.findById(req.params.id);
    if (!listing) return next(errorHandler(404, "ไม่พบโพสต์"));

    // ตรวจสอบสถานะที่อนุญาตให้เปลี่ยน
    const allowedStatuses = ["active", "completed", "closed"];
    if (req.body.status && !allowedStatuses.includes(req.body.status)) {
      return next(errorHandler(400, "สถานะไม่ถูกต้อง"));
    }

    // อัปเดตสถานะและจัดการวันหมดอายุ
    if (req.body.status === "active") {
      // ถ้าสถานะเป็น active ให้คงวันหมดอายุเดิมไว้
      req.body.expiryAt = listing.expiryAt;
    } else if (req.body.status === "closed") {
      // ถ้าสถานะเป็น closed ให้ต่ออายุโพสต์ใหม่
      const newCreatedDate = new Date(); // วันที่กดต่ออายุ
      const newExpirationDate = new Date(newCreatedDate);
      newExpirationDate.setDate(newExpirationDate.getDate() + 14); // เพิ่มวันหมดอายุอีก 14 วัน

      req.body.createdAt = newCreatedDate;
      req.body.expiryAt = newExpirationDate;
    }

    // เพิ่มการอัปเดตสถานะอย่างง่ายจากโค้ดใหม่
    if (req.body.status) {
      listing.status = req.body.status;
    }

    // อัปเดตข้อมูลในฐานข้อมูล
    const updatedListing = await Listing.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    // ตรวจสอบผลลัพธ์
    if (!updatedListing) {
      return next(errorHandler(404, "ไม่สามารถอัปเดตโพสต์ได้"));
    }

    console.log(req.body);

    // ส่งข้อมูลโพสต์ที่อัปเดตกลับไปยังผู้ใช้
    res.status(200).json({
      success: true,
      message: "อัปเดตโพสต์สำเร็จ",
      data: updatedListing,
    });
  } catch (error) {
    next(error);
  }
};

export const deleteListing = async (req, res, next) => {
  const listing = await Listing.findById(req.params.id);
  if (!listing) return next(errorHandler(404, "Listing not found"));

  try {
    await Listing.findByIdAndDelete(req.params.id);
    res.status(200).json("Listing has been deleted!");
  } catch (error) {
    next(error);
  }
};

export const getListing = async (req, res, next) => {
  try {
    const {
      searchTerm,
      type,
      sort,
      order,
      minPrice,
      maxPrice,
      limit,
      startIndex,
      status,
    } = req.query;

    // Default values for pagination
    const itemsPerPage = parseInt(limit) || 9;
    const skipItems = parseInt(startIndex) || 0;

    // Build the query object
    const query = { status: status || "active" };

    // Add search functionality for title
    if (searchTerm) {
      query.title = { $regex: searchTerm, $options: "i" }; // Case-insensitive search
    }

    // Filter by type if specified
    if (type && type !== "all") {
      query.type = type; // Exact match for the type
    } else {
      query.type = { $in: ["condo", "apartment"] }; // Default types if none specified
    }

    // Filter by price range
    if (minPrice || maxPrice) {
      query.price = {
        ...(minPrice ? { $gte: Number(minPrice) } : {}),
        ...(maxPrice ? { $lte: Number(maxPrice) } : {}),
      };
    }

    // Determine sorting options
    const sortKey = sort || "updatedAt"; // Default sort by updatedAt
    const sortOrder = order === "asc" ? 1 : -1; // Ascending or descending
    const sortOptions = { [sortKey]: sortOrder };

    // Execute the query with pagination and sorting
    const listings = await Listing.find(query)
      .sort(sortOptions) // Apply sorting
      .skip(skipItems) // Apply pagination (skip)
      .limit(itemsPerPage); // Limit the number of results

    // Return the results
    return res.status(200).json(listings);
  } catch (error) {
    next(error);
  }
};

export const searchListing = async (req, res, next) => {
  try {
    const { query } = req.query; // รับคำค้นหาจาก query parameter

    // ค้นหาข้อมูลในทุกฟิลด์ที่เกี่ยวข้อง
    const listings = await Listing.find({
      $or: [
        { title: { $regex: query, $options: "i" } },
        { type: { $regex: query, $options: "i" } },
        { rentalType: { $regex: query, $options: "i" } },
        { desc: { $regex: query, $options: "i" } },
        { address: { $regex: query, $options: "i" } },
        { province: { $regex: query, $options: "i" } },
        { district: { $regex: query, $options: "i" } },
        { subdistrict: { $regex: query, $options: "i" } },
      ],
    });

    res.status(200).json({ success: true, listings });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
