// model/schemas/DailyTicketLimit.js
import mongoose from "mongoose";

const dailyTicketLimitSchema = new mongoose.Schema({
  date: { type: Date, required: true, unique: true }, // UTC 00:00
  totalCapacity: { type: Number, required: true },
  perCategoryCapacity: {
    adult: { type: Number, required: true },
    child: { type: Number, required: true },
    student: { type: Number, required: true },
  },
  soldCounts: {
    total: { type: Number, default: 0 },
    adult: { type: Number, default: 0 },
    child: { type: Number, default: 0 },
    student: { type: Number, default: 0 },
  },
  updatedAt: { type: Date, default: Date.now }
}, { versionKey: false });


export const DailyTicketLimit = mongoose.model("DailyTicketLimit", dailyTicketLimitSchema, "dailyTicketLimits");
