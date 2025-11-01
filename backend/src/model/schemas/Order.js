import mongoose from "mongoose";

const orderSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  visitDate: { type: Date, required: true },
  items: [{
    categoryCode: { type: String },
    quantity: { type: Number },
    unitPrice: { type: Number },
    finalUnitPrice: { type: Number }
  }],
  pricing: {
    baseSubtotal: { type: Number },
    holidayMultiplier: { type: Number },
    discountCode: { type: String },
    discountAmount: { type: Number },
    totalPayable: { type: Number },
    currency: { type: String, default: "VND" }
  },
  status: { type: String, enum: ["pending", "paid", "failed", "cancelled", "expired"], default: "pending" },
  paymentId: { type: mongoose.Schema.Types.ObjectId, ref: "Payment" }
}, { timestamps: true });

export const Order = mongoose.model("Order", orderSchema, "orders");
