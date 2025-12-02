import "dotenv/config";
import express from "express";
import cors from "cors";
import { connectDB } from "./config/db.js"; 
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

//admin 
import adminDashboardRoutes from "./admin/routers/dashboardRoutes.js";
import adminAuthRoutes from "./admin/routers/adminUser.routes.js";
import orderRoutes from "./admin/routers/orderRoutes.js";
import AdminuserRoutes from "./admin/routers/UserRoutes.js";
import Admindiscount from "./admin/routers/ADdiscountRoutes.js";
import AdminTicket from "./admin/routers/AdminTicket.js";
// ===== EXPRESS APP SETUP =====
import momo from "./routes/payments/Momo.js";
import vnpay from "./routes/payments/VNPay.js";
import momoNotify from "./routes/payments/momoNotify.js";


import aiRoute from "./routes/aiRoutes.js";

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());


app.get("/", (_req, res) => res.json({ ok: true }));



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
app.use("/api/payments/momo", momo);
app.use("/api/payments/vnpay", vnpay); 
app.use("/api/payments/momo", momoNotify);

// Admin routes
app.use("/api/admin", adminDashboardRoutes);
app.use("/api/admin", adminAuthRoutes);


app.use("/api/ai", aiRoute);


app.use("/api/admin/discount", Admindiscount);
app.use("/api/admin/order",orderRoutes);
app.use("/api/admin/user",AdminuserRoutes);
app.use("/api/admin/ticket",AdminTicket);
// ===== START SERVER =====

const PORT = process.env.PORT || 4000;
connectDB().then(() =>
  app.listen(PORT, () => console.log(`🚀 http://localhost:${PORT}`))
);