import express from "express";
import Discount from "../models/Discount.js";

const router = express.Router();

// GET ALL
router.get("/", async (req, res) => {
  try {
    const discounts = await Discount.find().sort({ createdAt: -1 });
    res.json(discounts);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET ONE
router.get("/:id", async (req, res) => {
  try {
    const discount = await Discount.findById(req.params.id);
    if (!discount) return res.status(404).json({ message: "Not found" });
    res.json(discount);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// POST
router.post("/", async (req, res) => {
  try {
    // Có thể gán cứng createdByAdminId nếu chưa có Auth
    const newDiscount = new Discount(req.body);
    const saved = await newDiscount.save();
    res.status(201).json(saved);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// PUT
router.put("/:id", async (req, res) => {
  try {
    const updated = await Discount.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updated);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// DELETE
router.delete("/:id", async (req, res) => {
  try {
    await Discount.findByIdAndDelete(req.params.id);
    res.json({ message: "Deleted" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;