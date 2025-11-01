import mongoose from "mongoose";

const adminUserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true, lowercase: true },
  passwordHash: { type: String, required: true },
  role: { type: String, enum: ["superadmin", "manager", "staff"], required: true },
  note: { type: String },
  status: { type: String, enum: ["active", "blocked"], default: "active" }
}, { timestamps: true });

export const AdminUser = mongoose.model("AdminUser", adminUserSchema, "adminUsers");
