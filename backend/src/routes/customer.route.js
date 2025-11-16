import express from "express";
import { User } from "../model/schemas/User.js";

const router = express.Router();

// /api/customers - Lấy danh sách khách hàng
router.get("/customers", async (req, res) => {
  try {
    const users = await User.find({})
      .lean();
    res.json({
      success: true,
      count: users.length,
      data: users,
    });
  } catch (error) {
    console.error("❌ Lỗi khi lấy danh sách khách hàng:", error);
    res.status(500).json({ success: false, error: error.message });
  }
});

export default router;
