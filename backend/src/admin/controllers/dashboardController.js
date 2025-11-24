import Order from "../models/Order.js";
import mongoose from "mongoose";

export const getDashboardStats = async (req, res) => {
  try {
    const today = new Date();
    const startOfDay = new Date(today.setHours(0, 0, 0, 0));
    const endOfDay = new Date(today.setHours(23, 59, 59, 999));

    const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
    const endOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0, 23, 59, 59);

    // ====== Revenue Today ======
    const daily = await Order.aggregate([
      {
        $match: {
          status: "paid",
          createdAt: { $gte: startOfDay, $lte: endOfDay }
        }
      },
      {
        $group: {
          _id: null,
          totalRevenue: { $sum: "$pricing.totalPayable" },
          totalOrders: { $sum: 1 }
        }
      }
    ]);

    // ====== Revenue This Month ======
    const monthly = await Order.aggregate([
      {
        $match: {
          status: "paid",
          createdAt: { $gte: startOfMonth, $lte: endOfMonth }
        }
      },
      {
        $group: {
          _id: null,
          totalRevenue: { $sum: "$pricing.totalPayable" },
          totalOrders: { $sum: 1 }
        }
      }
    ]);

    res.json({
      dailyRevenue: daily[0]?.totalRevenue || 0,
      dailyOrders: daily[0]?.totalOrders || 0,
      monthlyRevenue: monthly[0]?.totalRevenue || 0,
      monthlyOrders: monthly[0]?.totalOrders || 0
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};
