import mongoose from "mongoose";

const dailyLimitSchema = new mongoose.Schema({
  date: { type: Date, required: true },
  totalCapacity: { type: Number, default: null },
  perCategoryCapacity: { type: Object },
  soldCounts: { type: Object }
}, { timestamps: { updatedAt: true, createdAt: false } });

export const DailyTicketLimit = mongoose.model("DailyTicketLimit", dailyLimitSchema, "dailyTicketLimits");
