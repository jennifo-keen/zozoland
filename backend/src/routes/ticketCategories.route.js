import express from "express";
import { TicketCategory } from "../model/schemas/TicketCategory.js";

const router = express.Router();

router.get("/", async (_req, res) => {
  try {
    const docs = await TicketCategory
      .find({ isActive: true })
      .sort({ code: 1 })
      .lean();
    res.json(docs);
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: "Internal server error" });
  }
});

export default router;
