import express from "express";
import TicketInventory from "../models/ticket.js";

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const tickets = await TicketInventory.find().sort({ date: 1 });
    res.json(tickets);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const ticket = await TicketInventory.findById(req.params.id);
    if (!ticket) return res.status(404).json({ message: "Không tìm thấy" });
    res.json(ticket);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post("/", async (req, res) => {
  try {
    const { date } = req.body;

    const existingDate = await TicketInventory.findOne({ date: date });
    if (existingDate) {
      return res.status(400).json({ message: "DUPLICATE_DATE", detail: "Ngày này đã được cấu hình vé rồi!" });
    }

    const newTicket = new TicketInventory(req.body);
    const saved = await newTicket.save();
    res.status(201).json(saved);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.put("/:id", async (req, res) => {
  try {
    const updated = await TicketInventory.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updated);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    await TicketInventory.findByIdAndDelete(req.params.id);
    res.json({ message: "Đã xóa" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;