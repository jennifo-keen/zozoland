import express from "express";
import User from "../models/User.js"; 

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const users = await User.find().select("-password").sort({ createdAt: -1 });
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select("-password");
    if (!user) return res.status(404).json({ message: "Không tìm thấy user" });
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.put("/:id", async (req, res) => {
  try {
    const { fullName, phone, role, status, email, dob } = req.body;
    
    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      { fullName, phone, role, status, email, dob }, 
      { new: true }
    );
    res.json(updatedUser);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    res.json({ message: "Đã xóa thành công" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;