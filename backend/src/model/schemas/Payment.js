import mongoose from "mongoose";

const paymentSchema = new mongoose.Schema({
  orderId: { type: mongoose.Schema.Types.ObjectId, ref: "Order" },
  provider: { type: String },
  txnId: { type: String, unique: true },
  amount: { type: Number },
  currency: { type: String, default: "VND" },
  status: { type: String, enum: ["initiated", "succeeded", "failed"], default: "initiated" },
  paidAt: { type: Date },
  rawPayload: { type: Object }
}, { timestamps: true });

export const Payment = mongoose.model("Payment", paymentSchema, "payments");
