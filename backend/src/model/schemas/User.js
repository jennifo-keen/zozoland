import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  fullName: { type: String, required: true },
  email: { type: String, required: true, unique: true, lowercase: true },
  passwordHash: { type: String, required: true },
  phone: { type: String },
  address: { type: String },
  dob: { type: Date },
  status: { type: String, enum: ["active", "blocked"], default: "active" }
}, { timestamps: true });

export const User = mongoose.model("User", userSchema, "users");
