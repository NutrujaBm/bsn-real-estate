import Report from "../models/report.model.js";
import User from "../models/user.model.js";
import Listing from "../models/listing.model.js";
import Notification from "../models/notification.model.js";

// ฟังก์ชันสร้างรายงาน
export const createReport = async (req, res) => {
  try {
    const { reporter, reportedEntity, entityType, description, issueType } =
      req.body;

    // ตรวจสอบว่า issueType ถูกส่งมาหรือไม่
    if (!issueType) {
      return res
        .status(400)
        .json({ message: "กรุณาระบุปัญหาก่อนที่จะส่งรายงาน" });
    }

    if (!reporter || !reportedEntity || !description || !issueType) {
      return res.status(400).json({ message: "ข้อมูลไม่ครบถ้วน" });
    }

    // จำลองการบันทึกรายงานในฐานข้อมูล
    const newReport = new Report({
      reporter,
      reportedEntity,
      entityType,
      description,
      issueType,
    });

    await newReport.save();

    res.status(201).json({ message: "รายงานถูกส่งแล้ว" });
  } catch (error) {
    console.error("Error creating report:", error);
    res.status(500).json({ message: "เกิดข้อผิดพลาดในการส่งรายงาน" });
  }
};

// ฟังก์ชันดึงรายงานทั้งหมด
export const getReports = async (req, res) => {
  try {
    const reports = await Report.find().populate("reporter", "username"); // เติมข้อมูลผู้รายงาน (เฉพาะ username)

    // ตรวจสอบ entityType และ populate ค่าตามประเภท
    for (let report of reports) {
      if (report.entityType === "user") {
        // หาก entityType เป็น 'user', populate กับ User model
        await report.populate({
          path: "reportedEntity",
          select: "username", // ดึงเฉพาะฟิลด์ username จาก User
          model: "User",
        });
      } else if (report.entityType === "listing") {
        // หาก entityType เป็น 'listing', populate กับ Listing model
        await report.populate({
          path: "reportedEntity",
          select: "title", // ดึงเฉพาะฟิลด์ title จาก Listing
          model: "Listing",
        });
      }
    }

    console.log(reports); // ตรวจสอบว่า populate ทำงานถูกต้อง
    res.status(200).json(reports);
  } catch (error) {
    res
      .status(400)
      .json({ message: "Error fetching reports", error: error.message });
  }
};

// ฟังก์ชันดึงรายงานตาม ID
export const getReportById = async (req, res) => {
  try {
    const report = await Report.findById(req.params.id);
    if (!report) {
      return res.status(404).json({ message: "Report not found" });
    }
    res.status(200).json(report);
  } catch (error) {
    res
      .status(400)
      .json({ message: "Error fetching report", error: error.message });
  }
};

// ฟังก์ชันอัพเดตสถานะของรายงาน
export const updateReportStatus = async (req, res) => {
  try {
    const updatedReport = await Report.findByIdAndUpdate(
      req.params.id,
      { status: req.body.status },
      { new: true }
    );
    if (!updatedReport) {
      return res.status(404).json({ message: "Report not found" });
    }
    res
      .status(200)
      .json({ message: "Report status updated", data: updatedReport });
  } catch (error) {
    res
      .status(400)
      .json({ message: "Error updating report status", error: error.message });
  }
};

// ฟังก์ชันลบรายงาน
export const deleteReport = async (req, res) => {
  try {
    const report = await Report.findByIdAndDelete(req.params.id);
    if (!report) {
      return res.status(404).json({ message: "Report not found" });
    }
    res.status(200).json({ message: "Report deleted successfully" });
  } catch (error) {
    res
      .status(400)
      .json({ message: "Error deleting report", error: error.message });
  }
};
