import mongoose from "mongoose";

const holidaySchema = new mongoose.Schema({
  date: { type: Date, required: true, unique: true },
  name: { type: String, required: true },
  multiplier: { type: Number, default: 1.0 }
});

export const HolidayCalendar = mongoose.model("HolidayCalendar", holidaySchema, "holidayCalendar");
