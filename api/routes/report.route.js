import express from "express";
import {
  createReport,
  getReports,
  getReportById,
  updateReportStatus,
  deleteReport,
} from "../controllers/report.controller.js";
import { verifyToken } from "../utils/verifyUser.js";

const router = express.Router();

// Route สำหรับการสร้างรายงานใหม่
router.post("/create", verifyToken, createReport);

// Route สำหรับการดึงข้อมูลรายงานทั้งหมด
router.get("/", getReports);

// Route สำหรับการดึงข้อมูลรายงานตาม ID
router.get("/:id", getReportById);

// Route สำหรับการแก้ไขสถานะรายงาน
router.put("/:id/status", updateReportStatus);

// Route สำหรับการลบรายงาน
router.delete("/:id", deleteReport);

export default router;
