// routes/animalRoutes.js
import express from "express";
import mongoose from "mongoose";        // ⬅️ THÊM DÒNG NÀY
import { Animal } from "../model/schemas/Animals.js";

const router = express.Router();

// GET /api/animals/random?limit=5&exhibitId=<id>
router.get("/random", async (req, res) => {
  const limit = Math.max(1, Math.min(+req.query.limit || 5, 20));
  const { exhibitId } = req.query;

  try {
    const match = { isActive: true };
    if (exhibitId) match.exhibitId = new mongoose.Types.ObjectId(exhibitId);

    const sampled = await Animal.aggregate([
      { $match: match },
      { $sample: { size: limit } }
    ]);

    // Lấy lại theo _id để populate (tùy bạn, có thể bỏ nếu không cần)
    const ids = sampled.map(a => a._id);
    const animals = await Animal.find({ _id: { $in: ids } })
      .populate("exhibitId", "slug name")
      .lean();

    // Giữ thứ tự ngẫu nhiên
    const map = new Map(animals.map(a => [String(a._id), a]));
    res.json(sampled.map(a => map.get(String(a._id)) || a));
  } catch (err) {
    console.error("Random animals error:", err);
    res.status(500).json({ message: err.message });
  }
});

export default router;
