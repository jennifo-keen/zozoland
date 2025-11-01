import mongoose from "mongoose";

const discountCodeSchema = new mongoose.Schema({
  code: { type: String, required: true, unique: true },
  type: { type: String, enum: ["percent", "fixed"], required: true },
  value: { type: Number, required: true },
  minOrderAmount: { type: Number },
  startsAt: { type: Date },
  endsAt: { type: Date },
  usageLimit: { type: Number },
  usedCount: { type: Number, default: 0 },
  perUserLimit: { type: Number },
  allowedCategories: [{ type: String }],
  isActive: { type: Boolean, default: true },
  createdByAdminId: { type: mongoose.Schema.Types.ObjectId, ref: "AdminUser" }
}, { timestamps: { updatedAt: true, createdAt: true } });

export const DiscountCode = mongoose.model("DiscountCode", discountCodeSchema, "discountCodes");
