import mongoose from "mongoose";

const discountSchema = new mongoose.Schema({
  code: { type: String, required: true, unique: true, uppercase: true },
  type: { type: String, enum: ["fixed", "percent"], required: true },
  value: { type: Number, required: true },
  minOrderAmount: { type: Number, default: 0 },
  startsAt: { type: Date, required: true },
  endsAt: { type: Date, required: true },
  usageLimit: { type: Number, default: 100 },
  usedCount: { type: Number, default: 0 },
  perUserLimit: { type: Number, default: 1 },
  allowedCategories: { type: [String], default: [] },
  isActive: { type: Boolean, default: true },
}, { timestamps: true, collection: "discountCodes" });

export default mongoose.models.Discount || mongoose.model("Discount", discountSchema);