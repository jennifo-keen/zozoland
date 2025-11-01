import mongoose from "mongoose";

const ticketCategorySchema = new mongoose.Schema(
  {
    code: { type: String, required: true, unique: true, trim: true },
    name: { type: String, required: true, trim: true },
    basePrice: { type: Number, required: true, min: 0 },
    currency: { type: String, default: "VND" },
    image: { type: String },                      // URL ảnh
    minAge: { type: Number },
    maxAge: { type: Number },
    isActive: { type: Boolean, default: true },

    // 🔥 NEW: danh sách mô tả từ DB (nếu có)
    features: {
      type: [String],
      default: [],
      validate: {
        validator: (arr) => Array.isArray(arr) && arr.every((s) => typeof s === "string"),
        message: "features must be an array of strings",
      },
    },
  },
  { timestamps: { updatedAt: true, createdAt: false } }
);

// index nhẹ cho truy vấn theo code/active
ticketCategorySchema.index({ code: 1 }, { unique: true });
ticketCategorySchema.index({ isActive: 1 });

export const TicketCategory = mongoose.model(
  "TicketCategory",
  ticketCategorySchema,
  "ticketCategories"
);
