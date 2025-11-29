import express from "express";
import Order from "../models/Order.js";

const router = express.Router();

router.get("/daily-revenue", async (req, res) => {
  try {
    const data = await Order.aggregate([
      { $match: { status: "paid" } }, 
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m-%d", date: "$visitDate" } },
          totalRevenue: { $sum: "$pricing.totalPayable" }
        }
      },
      { $sort: { _id: 1 } } 
    ]);
    
    const formatted = data.map(item => ({ date: item._id, revenue: item.totalRevenue }));
    res.json(formatted);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get("/monthly-revenue", async (req, res) => {
  try {
    const data = await Order.aggregate([
      { $match: { status: "paid" } },
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m", date: "$visitDate" } }, // Gom nhóm theo tháng
          totalRevenue: { $sum: "$pricing.totalPayable" }
        }
      },
      { $sort: { _id: 1 } }
    ]);

    const formatted = data.map(item => ({ month: item._id, revenue: item.totalRevenue }));
    res.json(formatted);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;