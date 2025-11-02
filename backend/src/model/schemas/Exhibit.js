import mongoose from "mongoose";

const exhibitSchema = new mongoose.Schema({
  slug: { type: String, required: true, unique: true, index: true, trim: true, lowercase: true },
  name: { type: String, required: true },
  description: { type: String },
  heroImage: { type: String },
  galleryImages: [{ type: String }],
  tags: [{ type: String }],
  isActive: { type: Boolean, default: true },
  order: { type: Number }
}, { timestamps: { updatedAt: true, createdAt: false } });

export const Exhibit = mongoose.model("Exhibit", exhibitSchema, "exhibits");
