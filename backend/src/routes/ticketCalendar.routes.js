// routes/ticketCalendarRoutes.js
import express from "express";
import { DailyTicketLimit } from "../model/schemas/DailyTicketLimit.js";
import { Reservation } from "../model/schemas/Reservation.js";

const router = express.Router();

router.get("/availability", async (req, res) => {
  try {
    let year, month;

    if (req.query.date) {
      const d = new Date(req.query.date);
      if (isNaN(d.getTime())) {
        return res.status(400).json({ error: "date không hợp lệ" });
      }
      year = d.getUTCFullYear();
      month = d.getUTCMonth() + 1; // 1..12
    } else {
      year = parseInt(req.query.year, 10);
      month = parseInt(req.query.month, 10);
    }

    if (!year || !month || month < 1 || month > 12) {
      return res.status(400).json({ error: "Thiếu hoặc sai year/month/date" });
    }

    const start = new Date(Date.UTC(year, month - 1, 1));
    const end   = new Date(Date.UTC(year, month, 1));

    const docs = await DailyTicketLimit.find({
      date: { $gte: start, $lt: end }
    }).lean();

    const pad = (n) => (n < 10 ? `0${n}` : `${n}`);
    const keyOf = (d) =>
      `${d.getUTCFullYear()}-${pad(d.getUTCMonth() + 1)}-${pad(d.getUTCDate())}`;

    const map = new Map(docs.map(d => [keyOf(new Date(d.date)), d]));

    const out = [];
    for (let d = new Date(start); d < end; d.setUTCDate(d.getUTCDate() + 1)) {
    const k = keyOf(d);
    const doc = map.get(k);

    if (!doc) {
        out.push({
        date: d.toISOString(),
        totalCapacity: 0,
        soldCounts: { total: 0, adult: 0, child: 0, student: 0 },
        remaining: 0,
        available: false
        });
    } else {

        const now = new Date();
        const holds = await Reservation.aggregate([
        {
            $match: {
            visitDate: d,
            status: "holding",
            expiresAt: { $gt: now }
            }
        },
        {
            $group: {
            _id: null,
            total: { $sum: { $add: ["$quantities.adult", "$quantities.child", "$quantities.student"] } },
            adult: { $sum: "$quantities.adult" },
            child: { $sum: "$quantities.child" },
            student: { $sum: "$quantities.student" }
            }
        }
        ]);

        const h = holds[0] || { total: 0, adult: 0, child: 0, student: 0 };
        const soldTotal =
        doc.soldCounts?.total ??
        ((doc.soldCounts?.adult || 0) + (doc.soldCounts?.child || 0) + (doc.soldCounts?.student || 0));
        const remaining = Math.max(0, doc.totalCapacity - soldTotal - (h.total || 0));

        out.push({
        date: new Date(doc.date).toISOString(),
        totalCapacity: doc.totalCapacity,
        soldCounts: doc.soldCounts || { total: soldTotal },
        holding: h, // (tùy chọn: thêm vào response để debug)
        remaining,
        available: remaining > 0
        });
    }
    }


    res.json(out);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

export default router;
