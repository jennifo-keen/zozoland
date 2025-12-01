import mongoose from "mongoose";

const ticketInventorySchema = new mongoose.Schema({
  date: { type: Date, required: true, unique: true }, 
  totalCapacity: { type: Number, required: true },    
  
  perCategoryCapacity: {
    adult: { type: Number, required: true },
    child: { type: Number, required: true },
    student: { type: Number, required: true }
  },

  soldCounts: {
    total: { type: Number, default: 0 },
    adult: { type: Number, default: 0 },
    child: { type: Number, default: 0 },
    student: { type: Number, default: 0 }
  }
}, { timestamps: true, collection: "dailyTicketLimits" });

export default mongoose.models.TicketInventory || mongoose.model("TicketInventory", ticketInventorySchema);