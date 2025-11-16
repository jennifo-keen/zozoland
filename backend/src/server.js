import "dotenv/config";
import express from "express";
import cors from "cors";
import { connectDB } from "./config/db.js"; // ⚠️ đường dẫn đã chỉnh lại 1 cấp
import { User } from "./model/schemas/User.js";
import "./model/schemas/Exhibit.js"

// ➕ import routes
import customerRoutes from "./routes/customer.route.js";
import ticketCategoriesRoutes from "./routes/ticketCategories.route.js";
import animalRoutes from "./routes/animal.routes.js";
import exhibitRoutes from "./routes/exhibit.routes.js";
import authRoutes from "./routes/auth.routes.js";
import ticketCalendarRoutes from "./routes/ticketCalendar.routes.js";
import reservationRoutes from "./routes/reservation.routes.js";
import ticketCatalogRoutes from "./routes/ticketCatalog.routes.js";
import userRoutes from "./routes/userinfo.route.js";
import discountRoutes from "./routes/discount.routes.js";
// ===== EXPRESS APP SETUP =====
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());


app.get("/", (_req, res) => res.json({ ok: true }));

// ✅ mount API

app.use("/api", customerRoutes);
app.use("/api/ticket-categories", ticketCategoriesRoutes);
app.use("/api/animals", animalRoutes);
app.use("/api/exhibits", exhibitRoutes);
app.use("/auth", authRoutes);
app.use("/api/tickets", ticketCalendarRoutes);
app.use("/api/reservations", reservationRoutes);
app.use("/api/tickets", ticketCatalogRoutes);
app.use("/api/userinfo", userRoutes);
app.use("/api/discounts", discountRoutes);
// ===== START SERVER =====
const PORT = process.env.PORT || 4000;
connectDB().then(() =>
  app.listen(PORT, () => console.log(`🚀 http://localhost:${PORT}`))
);
