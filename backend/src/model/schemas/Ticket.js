import mongoose from "mongoose";

const ticketSchema = new mongoose.Schema({
  orderId: { type: mongoose.Schema.Types.ObjectId, ref: "Order" },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  visitDate: { type: Date },
  categoryCode: { type: String },
  qrCode: { type: String, unique: true },
  status: { type: String, enum: ["active", "used", "expired", "cancelled"], default: "active" }
}, { timestamps: { createdAt: true, updatedAt: false } });

export const Ticket = mongoose.model("Ticket", ticketSchema, "tickets");
