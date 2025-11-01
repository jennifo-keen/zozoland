import express from "express";
import { Exhibit } from "../model/schemas/Exhibit.js";

const router = express.Router();

// GET /api/exhibits?active=true&limit=6
router.get("/", async (req, res) => {
  const limit = Math.max(1, Math.min(+req.query.limit || 6, 50));
  const active = req.query.active !== "false"; // mặc định chỉ lấy isActive=true

  try {
    const query = active ? { isActive: true } : {};
    const exhibits = await Exhibit.find(query)
      .sort({ order: 1, name: 1 })
      .limit(limit)
      .lean();

    res.json(exhibits);
  } catch (err) {
    console.error("List exhibits error:", err);
    res.status(500).json({ message: err.message });
  }
});

export default router;
