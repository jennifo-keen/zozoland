import express from "express";
import { User } from "../model/schemas/User.js";
import { Order } from "../model/schemas/Order.js";
import { Ticket } from "../model/schemas/Ticket.js";
import bcrypt from "bcryptjs";

const router = express.Router();

// GET /api/users/:id → lấy thông tin người dùng
router.get("/:id", async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select("-passwordHash");
    if (!user) return res.status(404).json({ error: "Không tìm thấy người dùng" });
    res.json(user);
  } catch (err) {
    console.error("Lỗi khi lấy người dùng:", err);
    res.status(500).json({ error: "Lỗi server" });
  }
});

// PUT /api/users/:id → cập nhật thông tin người dùng
router.put("/:id", async (req, res) => {
  try {
    const { fullName, email, phone, dob, address } = req.body;
    const updated = await User.findByIdAndUpdate(
      req.params.id,
      { fullName, email, phone, dob, address },
      { new: true, runValidators: true }
    ).select("-passwordHash");

    if (!updated) return res.status(404).json({ error: "Không tìm thấy người dùng" });
    res.json(updated);
  } catch (err) {
    console.error("Lỗi khi cập nhật người dùng:", err);
    res.status(500).json({ error: "Lỗi server" });
  }
});

// DELETE /api/users/:id → xóa tài khoản
router.delete("/:id", async (req, res) => {
  try {
    const deleted = await User.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ error: "Không tìm thấy người dùng" });
    res.json({ message: "Tài khoản đã được xóa" });
  } catch (err) {
    console.error("Lỗi khi xóa người dùng:", err);
    res.status(500).json({ error: "Lỗi server" });
  }
});
router.get("/:id/orders", async (req, res) => {
  try {
    const orders = await Order.find({ userId: req.params.id }).sort({ visitDate: -1 });
    res.json(orders);
  } catch (err) {
    console.error("Lỗi khi lấy đơn hàng:", err);
    res.status(500).json({ error: "Lỗi server" });
  }
});
router.get("/:id/orders/:orderId/tickets", async (req, res) => {
  const { orderId } = req.params;
  try {
    const tickets = await Ticket.find({ orderId });
    res.json(tickets);
  } catch (err) {
    console.error("Lỗi khi lấy vé:", err);
    res.status(500).json({ error: "Lỗi server" });
  }
});

// PUT /api/users/:id/changepassword → đổi mật khẩu
router.put("/:id/changepassword", async (req, res) => {
  try {
    const { currentPassword, newPassword, confirmPassword } = req.body;

    if (!currentPassword || !newPassword || !confirmPassword) {
      return res.status(400).json({ error: "Thiếu thông tin mật khẩu" });
    }

    if (newPassword !== confirmPassword) {
      return res.status(400).json({ error: "Mật khẩu mới không khớp" });
    }

    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ error: "Không tìm thấy người dùng" });

    const isMatch = await bcrypt.compare(currentPassword, user.passwordHash);
    if (!isMatch) {
      return res.status(401).json({ error: "Mật khẩu hiện tại không đúng" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    user.passwordHash = hashedPassword;
    await user.save();

    res.json({ message: "Mật khẩu đã được cập nhật thành công" });
  } catch (err) {
    console.error("Lỗi khi đổi mật khẩu:", err);
    res.status(500).json({ error: "Lỗi server" });
  }
});

export default router;