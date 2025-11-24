import express from "express";
import { getDashboardStats } from "../controllers/dashboardController.js";
import checkAdmin from "../middleware/checkAdmin.js";

const router = express.Router();

router.get("/stats", checkAdmin, getDashboardStats);

export default router;
