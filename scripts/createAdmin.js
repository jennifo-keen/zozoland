import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import AdminUser from "../backend/src/admin/models/AdminUser.js";

// Import để xử lý absolute path
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

// Lấy đường dẫn thực tới script
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load .env nằm trong chính folder scripts
dotenv.config({
  path: path.join(__dirname, ".env")
});

// Debug xem dotenv đã load chưa
console.log("DEBUG MONGODB_URI =", process.env.MONGODB_URI);

const createAdmin = async () => {
  try {
    const MONGO_URI = process.env.MONGODB_URI;

    if (!MONGO_URI) {
      console.log("❌ MONGODB_URI không tồn tại! Kiểm tra file .env trong thư mục scripts");
      process.exit(1);
    }

    // Kết nối database
    await mongoose.connect(MONGO_URI);
    console.log("Connected to MongoDB");

    const email = "admin@zoo.com";
    const password = "admin123";
    const name = "Super Admin";

    const existing = await AdminUser.findOne({ email });
    if (existing) {
      console.log("❌ Admin đã tồn tại.");
      process.exit(0);
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await AdminUser.create({
      email,
      password: hashedPassword,
      name,
      role: "admin"
    });

    console.log("✅ Admin created!");
    process.exit(0);
  } catch (err) {
    console.error("❌ Error creating admin:", err);
    process.exit(1);
  }
};

createAdmin();
