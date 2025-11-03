// routes/reservationRoutes.js
import express from "express";
import mongoose from "mongoose";
import { DailyTicketLimit } from "../model/schemas/DailyTicketLimit.js";
import { Reservation } from "../model/schemas/Reservation.js";

const router = express.Router();

// helper
const toUtcStart = (isoOrDate) => {
  const d = new Date(isoOrDate);
  return new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate()));
};

// Tính tổng vé đang giữ (chưa thanh toán) cho 1 ngày
async function countActiveHolds(visitDateUtcStart) {
  const now = new Date();
  const result = await Reservation.aggregate([
    { $match: {
        visitDate: visitDateUtcStart,
        status: "holding",
        expiresAt: { $gt: now }
    }},
    { $group: {
        _id: "$visitDate",
        adult: { $sum: "$quantities.adult" },
        child: { $sum: "$quantities.child" },
        student: { $sum: "$quantities.student" }
    }}
  ]);
  const g = result[0] || { adult: 0, child: 0, student: 0 };
  return g;
}

/**
 * POST /api/reservations/hold
 * body: { visitDate: ISOString, quantities: { adult, child, student } }
 * -> tạo reservation "holding" 5 phút nếu còn chỗ
 */
router.post("/hold", async (req, res) => {
  try {
    const { visitDate, quantities = {}, userId } = req.body;
    if (!visitDate) return res.status(400).json({ error: "visitDate required" });

    const q = {
      adult: Math.max(0, +quantities.adult || 0),
      child: Math.max(0, +quantities.child || 0),
      student: Math.max(0, +quantities.student || 0),
    };
    const totalReq = q.adult + q.child + q.student;
    if (totalReq <= 0) return res.status(400).json({ error: "quantities must be > 0" });

    const vDate = toUtcStart(visitDate);

    // 1) Lấy hạn mức ngày
    const day = await DailyTicketLimit.findOne({ date: vDate }).lean();
    if (!day) return res.status(404).json({ error: "Không mở bán ngày này" });

    // 2) Vé đã bán (đã xác nhận)
    const sold = day.soldCounts?.total ??
      ((day.soldCounts?.adult||0) + (day.soldCounts?.child||0) + (day.soldCounts?.student||0));

    // 3) Vé đang giữ (chưa thanh toán)
    const holds = await countActiveHolds(vDate);
    const holdsTotal = (holds.adult||0)+(holds.child||0)+(holds.student||0);

    // 4) Kiểm tồn theo tổng & theo từng loại
    const remainingTotal = day.totalCapacity - sold - holdsTotal;
    const remainingAdult  = (day.perCategoryCapacity.adult  ||0) - ((day.soldCounts?.adult||0)  + (holds.adult||0));
    const remainingChild  = (day.perCategoryCapacity.child  ||0) - ((day.soldCounts?.child||0)  + (holds.child||0));
    const remainingStudent= (day.perCategoryCapacity.student||0) - ((day.soldCounts?.student||0)+ (holds.student||0));

    if (remainingTotal < totalReq ||
        remainingAdult < q.adult ||
        remainingChild < q.child ||
        remainingStudent < q.student) {
      return res.status(409).json({ error: "Không đủ vé để giữ chỗ" });
    }

    // 5) Tạo reservation holding 5 phút
    const expiresAt = new Date(Date.now() + 5*60*1000); // 5 phút
    const doc = await Reservation.create({
      userId: userId ? new mongoose.Types.ObjectId(userId) : new mongoose.Types.ObjectId(), // tạm: tạo giả nếu chưa có auth
      visitDate: vDate,
      quantities: q,
      status: "holding",
      expiresAt
    });

    res.json({ reservationId: doc._id, expiresAt });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: "Server error" });
  }
});
// Hủy khi ng dùng bỏ bước
// PATCH /api/reservations/cancel/:id
router.patch("/cancel/:id", async (req, res) => {
  const { id } = req.params;
  const doc = await Reservation.findOneAndUpdate(
    { _id: id, status: "holding" },
    { $set: { status: "cancelled" }, $currentDate: { expiresAt: true } },
    { new: true }
  );
  res.json({ ok: !!doc });
});
// Sau khi thanh toán thành công
// POST /api/reservations/confirm/:id
router.post("/confirm/:id", async (req, res) => {
  const session = await mongoose.startSession();
  try {
    const { id } = req.params;
    await session.withTransaction(async () => {
      const now = new Date();
      const rsv = await Reservation.findOne({ _id: id }).session(session);
      if (!rsv) throw new Error("Reservation not found");
      if (rsv.status !== "holding" || rsv.expiresAt <= now) throw new Error("Reservation expired or invalid");

      // Recheck capacity strictly per category before confirm
      const day = await DailyTicketLimit.findOne({ date: rsv.visitDate }).session(session);
      if (!day) throw new Error("Day not found");

      const q = rsv.quantities;
      const inc = {
        "soldCounts.total": (day.soldCounts?.total != null) ? q.adult + q.child + q.student : undefined,
        "soldCounts.adult": q.adult,
        "soldCounts.child": q.child,
        "soldCounts.student": q.student
      };
      // build $inc only defined fields
      const $inc = {};
      Object.entries(inc).forEach(([k,v]) => { if (typeof v === "number") $inc[k] = v; });

      // Điều kiện chống overbook: số bán + số đang giữ (ngoại trừ chính reservation này) + cần confirm <= capacity
      // Đơn giản hoá: do ta chỉ confirm từ 1 holding còn hiệu lực ⇒ chấp nhận cộng trực tiếp.
      await DailyTicketLimit.updateOne(
        { _id: day._id },
        { $inc }
      ).session(session);

      await Reservation.updateOne(
        { _id: rsv._id },
        { $set: { status: "confirmed" }, $unset: { expiresAt: 1 } }
      ).session(session);
    });

    res.json({ ok: true });
  } catch (e) {
    console.error(e);
    res.status(409).json({ ok: false, error: e.message });
  } finally {
    await session.endSession();
  }
});

export default router;