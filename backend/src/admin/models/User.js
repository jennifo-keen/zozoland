import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  fullName: String,
  phone: String,
  role: { type: String, default: "user" }, 
  status: { type: String, default: "active" }, 
  password: { type: String, required: true },
}, { timestamps: true, collection: "users" });

export default mongoose.models.User || mongoose.model("User", userSchema);