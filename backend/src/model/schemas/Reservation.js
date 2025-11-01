import mongoose from "mongoose";

const reservationSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  visitDate: { type: Date, required: true },
  quantities: { type: Object },
  status: { type: String, enum: ["holding", "released", "converted"], default: "holding" },
  expiresAt: { type: Date }
}, { timestamps: { createdAt: true, updatedAt: false } });

export const Reservation = mongoose.model("Reservation", reservationSchema, "reservations");
