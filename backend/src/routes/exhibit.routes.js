import express from "express";
import mongoose from "mongoose";          
import {Animal} from "../model/schemas/Animals.js";
import { findExhibitByIdOrSlug } from "../model/utils/exhibitLookup.js";
import { Exhibit } from "../model/schemas/Exhibit.js";

const router = express.Router();

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

router.get("/:idOrSlug", async (req, res) => {
  const { idOrSlug } = req.params;
  try {
    let exhibit = null;

    if (mongoose.isValidObjectId(idOrSlug)) {
      exhibit = await Exhibit.findById(idOrSlug);
    } else {
      exhibit = await Exhibit.findOne({ slug: idOrSlug });
    }

    if (!exhibit) return res.status(404).json({ message: "Không tìm thấy khu vực" });
    res.json(exhibit);
  } catch (err) {
    res.status(500).json({ message: "Lỗi server", error: err.message });
  }
});
// GET /api/exhibits/:idOrSlug/animals
router.get("/:idOrSlug/animals", async (req, res) => {
  try {
    const ex = await findExhibitByIdOrSlug(req.params.idOrSlug);
    if (!ex) return res.status(404).json({ message: "Exhibit not found" });

    const limit  = Math.min(parseInt(req.query.limit || "20", 10), 50);
    const fields = (req.query.fields
      ? req.query.fields.replace(/\s/g, "").split(",").join(" ")
      : "name slug heroImage shortDescription sciName exhibit exhibitId exhibits");
    const filter = {
      isActive: true,
      $or: [
        { exhibit: ex._id },                 // nếu bạn dùng Animal.exhibit (ObjectId)
        { exhibitId: ex._id },               // nếu bạn dùng Animal.exhibitId (ObjectId)  ← TRƯỜNG HỢP CỦA BẠN
        { exhibits: { $in: [ex._id] } },     // nếu bạn lưu mảng exhibits: [ObjectId]
      ],
    };

    const animals = await Animal.find(filter)
      .select(fields)
      .sort({ createdAt: -1 })
      .limit(limit)
      .lean();

    // Chuẩn hoá trả về exhibitId cho FE
    const mapped = animals.map(a => ({
      ...a,
      exhibitId: a.exhibit ?? a.exhibitId ?? undefined
    }));

    res.json({ exhibitId: ex._id.toString(), animals: mapped });
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
});


export default router;
