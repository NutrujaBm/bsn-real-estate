import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import userRouter from "./routes/user.route.js";
import authRouter from "./routes/auth.route.js";
import listRouter from "./routes/listing.route.js";
import reportRouter from "./routes/report.route.js";
import cookieParser from "cookie-parser";
import path from "path";
import cron from "node-cron"; // ติดตั้ง node-cron
import Listing from "./models/listing.model.js"; // นำเข้าโมเดล Listing

dotenv.config();

mongoose
  .connect(process.env.DATABASE_URL)
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((err) => {
    console.log("Error: " + err);
  });

const __dirname = path.resolve();

const app = express();

app.use(express.json());
app.use(cookieParser());

// ตั้งค่า Cron Job ให้รันทุกวันเวลาเที่ยงคืน
cron.schedule("0 0 * * *", async () => {
  try {
    const now = new Date();
    const result = await Listing.updateMany(
      { expiryAt: { $lt: now }, status: "active" }, // เงื่อนไขสำหรับโพสต์หมดอายุ
      { status: "closed" } // เปลี่ยนสถานะเป็น closed
    );
    // แสดงจำนวนโพสต์ที่ถูกอัปเดต
    console.log(`Updated ${result.modifiedCount} expired listings.`);
  } catch (error) {
    // ถ้ามีข้อผิดพลาดให้แสดง log
    console.error("Error updating expired listings:", error);
  }
});

app.listen(3000, () => {
  console.log("Server is running on port 3000!!!");
});

app.use("/api/user", userRouter);
app.use("/api/auth", authRouter);
app.use("/api/listing", listRouter);
app.use("/api/report", reportRouter);

app.use(express.static(path.join(__dirname, "/client/dist")));

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "client", "dist", "index.html"));
});

app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || "Internal Server Error";
  return res.status(statusCode).json({
    success: false,
    statusCode,
    message,
  });
});
