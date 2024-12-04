import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import userRouter from "./routes/user.route.js";
import authRouter from "./routes/auth.route.js";
import listRouter from "./routes/listing.route.js";
import reportRouter from "./routes/report.route.js";
import cookieParser from "cookie-parser";
import path from "path";
import cors from "cors";

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

// กำหนด CORS สำหรับ production โดยอนุญาตให้เฉพาะโดเมนที่เชื่อถือได้
const corsOptions = {
  origin: process.env.CORS_ALLOWED_ORIGIN, // รับค่าโดเมนจาก .env
  methods: "GET,POST,PUT,DELETE",
  credentials: true, // ถ้าต้องการให้สามารถส่ง cookies หรือ authorization headers ได้
};

app.use(cors(corsOptions)); // ใช้ CORS ที่ปรับแต่ง

app.use(express.json());
app.use(cookieParser());

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
