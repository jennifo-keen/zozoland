import mongoose from "mongoose";

const orderSchema = new mongoose.Schema({
  userId: mongoose.Schema.Types.ObjectId,
  visitDate: Date,
  items: [
    {
      categoryCode: String,
      quantity: Number,
      unitPrice: Number,
      finalUnitPrice: Number
    }
  ],
  pricing: {
    baseSubtotal: Number,
    holidayMultiplier: Number,
    discountCode: String,
    discountAmount: Number,
    totalPayable: Number,
    currency: String
  },
  status: String,
  paymentId: mongoose.Schema.Types.ObjectId
}, { timestamps: true });

const Order = mongoose.models.Order || mongoose.model("Order", orderSchema);

export default Order;