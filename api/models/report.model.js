import mongoose from "mongoose";

const reportSchema = new mongoose.Schema(
  {
    reporter: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User", // อ้างอิงไปที่ User สำหรับผู้รายงาน
    },
    reportedEntity: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      refPath: "reportedEntityModel", // ใช้ refPath เพื่อเลือกโมเดลที่ต้องการ
    },
    reportedEntityModel: {
      type: String,
      //   required: true,
      enum: ["Listing", "User"], // อาจจะเป็น Listing หรือ User
    },
    entityType: {
      type: String,
      enum: ["listing", "user", "system"], // เพิ่ม 'system' สำหรับรายงานปัญหาที่เกี่ยวกับระบบ
      required: true,
    },
    issueType: {
      type: String,
      enum: [
        "incorrect-info", // ข้อมูลไม่ถูกต้อง
        "inappropriate-content", // เนื้อหาที่ไม่เหมาะสม
        "missing-information", // ข้อมูลหาย
        "fraudulent-post", // โพสต์ที่ไม่ถูกต้อง
        "impersonation", // การแอบอ้าง
        "hate-speech", // การพูดที่สร้างความเกลียดชัง
        "spam-and-fraud", // สแปมและการโกง
        "no-matching-issue", // ไม่มีปัญหาที่ตรงกับตัวเลือก
        "bug", // บั๊กในระบบ
        "performance-issue", // ปัญหาด้านประสิทธิภาพ
        "system-outage", // ระบบล่ม
      ],
      required: true,
    },
    description: {
      type: String,
      required: true, // คำอธิบายปัญหาที่ผู้รายงานแจ้ง
    },
    status: {
      type: String,
      enum: ["pending", "resolved", "in-progress"], // สถานะการรายงาน
      default: "pending", // เริ่มต้นเป็น 'pending'
    },
  },
  {
    timestamps: true, // เก็บเวลาเมื่อสร้างหรือแก้ไขเอกสาร
  }
);

const Report = mongoose.model("Report", reportSchema);

export default Report;
