import express from "express";
import { TicketCategory } from "../model/schemas/TicketCategory.js";   // bạn đã có schema này
import { DailyTicketLimit } from "../model/schemas/DailyTicketLimit.js";
import { Reservation } from "../model/schemas/Reservation.js";

const router = express.Router();

// GET /api/tickets/catalog?date=2025-11-20T00:00:00.000Z
router.get("/catalog", async (req, res) => {
  try {
    const dateISO = req.query.date;
    if (!dateISO) return res.status(400).json({ error: "date is required" });

    const d = new Date(dateISO);
    const visitDate = new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate()));
    const cats = await TicketCategory.find({ isActive: true }).lean();
    const day = await DailyTicketLimit.findOne({ date: visitDate }).lean();
    const now = new Date();
    const holdsByCat = await Reservation.aggregate([
      { $match: { visitDate, status: "holding", expiresAt: { $gt: now } } },
      { $group: {
          _id: "$visitDate",
          adult: { $sum: "$quantities.adult" },
          child: { $sum: "$quantities.child" },
          student: { $sum: "$quantities.student" }
      } }
    ]);
    const holds = holdsByCat[0] || { adult: 0, child: 0, student: 0 };

    const perCap = day?.perCategoryCapacity || {};
    const sold = day?.soldCounts || {};
    const safe = (n) => n || 0;
    const catalog = cats.map(c => {
      const code = (c.code || "").toLowerCase();
      const remaining = Math.max(
        0,
        safe(perCap[code]) - safe(sold[code]) - safe(holds[code])
      );

      return {
        id: String(c._id),
        code,
        name: c.name,
        basePrice: c.basePrice,
        currency: c.currency || "VND",
        description: c.description || "",
        remaining,
      };
    });

    res.json({
      date: visitDate.toISOString(),
      totalRemaining: Math.max(0, (day?.totalCapacity || 0) - (safe(sold.total) || (safe(sold.adult)+safe(sold.child)+safe(sold.student))) - (safe(holds.adult)+safe(holds.child)+safe(holds.student))),
      catalog
    });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: "Server error" });
  }
});

export default router;
