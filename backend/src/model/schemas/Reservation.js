// model/schemas/Reservation.js
import mongoose from "mongoose";

const reservationSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, required: true },     // hoặc lưu guestId/sessionId
  visitDate: { type: Date, required: true },                             // UTC 00:00 ngày tham quan
  quantities: {                                                          // số vé giữ chỗ
    adult: { type: Number, default: 0, min: 0 },
    child: { type: Number, default: 0, min: 0 },
    student: { type: Number, default: 0, min: 0 },
  },
  status: { type: String, enum: ["holding","confirmed","cancelled"], default: "holding" },
  expiresAt: { type: Date, required: true },                             // TTL index -> auto xoá
  createdAt: { type: Date, default: Date.now },
}, { versionKey: false });

reservationSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });               // TTL: xoá doc khi quá hạn
reservationSchema.index({ visitDate: 1, status: 1, expiresAt: 1 });                 // phục vụ tính availability
reservationSchema.index({ userId: 1, status: 1 });

export const Reservation = mongoose.model("Reservation", reservationSchema, "reservations");
