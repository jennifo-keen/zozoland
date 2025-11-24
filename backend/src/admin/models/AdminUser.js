import mongoose from "mongoose";

const adminUserSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  name: String,
  role: { type: String, default: "admin" }
}, { timestamps: true });

export default mongoose.models.AdminUser || mongoose.model("AdminUser", adminUserSchema);
