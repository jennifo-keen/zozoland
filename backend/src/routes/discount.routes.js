import express from "express";
import { DiscountCode } from "../model/schemas/DiscountCode.js";
const router = express.Router();

/**
 * GET /api/discounts/validate?code=ZOO10K&amount=120000
 */
router.get("/validate", async (req, res) => {
  try {
    const { code, amount } = req.query;
    if (!code) return res.status(400).json({ error: "Thiếu mã giảm giá" });

    const now = new Date();
    const discount = await DiscountCode.findOne({ code }).lean();
    if (!discount) return res.status(404).json({ error: "Mã không tồn tại" });
    if (!discount.isActive) return res.status(400).json({ error: "Mã đã bị vô hiệu hóa" });

    if (discount.startsAt && now < new Date(discount.startsAt))
      return res.status(400).json({ error: "Mã chưa bắt đầu hiệu lực" });
    if (discount.endsAt && now > new Date(discount.endsAt))
      return res.status(400).json({ error: "Mã đã hết hạn" });

    // kiểm tra giới hạn sử dụng
    if (
      (discount.usageLimit && discount.usedCount >= discount.usageLimit)
    )
      return res.status(400).json({ error: "Mã đã được dùng hết" });

    // kiểm tra tổng đơn tối thiểu
    const orderAmount = Number(amount || 0);
    if (discount.minOrderAmount && orderAmount < discount.minOrderAmount)
      return res.status(400).json({ error: `Đơn tối thiểu ${discount.minOrderAmount} VND để dùng mã này` });

    // tính giá trị giảm
    let discountValue = 0;
    if (discount.type === "fixed") {
      discountValue = discount.value;
    } else if (discount.type === "percent") {
      discountValue = (orderAmount * discount.value) / 100;
    }

    res.json({
      ok: true,
      code: discount.code,
      type: discount.type,
      value: discountValue,
      message: `Áp dụng mã ${discount.code} thành công - Giảm ${discountValue.toLocaleString()} VND`,
    });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: "Lỗi server khi kiểm tra mã giảm giá" });
  }
});

export default router;
