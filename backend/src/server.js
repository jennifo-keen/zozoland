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

// ===== EXPRESS APP SETUP =====
const app = express();
app.use(express.json());
app.use(cors());

// ===== LOGIN DEMO (bạn giữ nguyên) =====
app.post("/auth/login-plain", async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password)
      return res.status(400).json({ error: "Missing email or password" });

    const user = await User.findOne({
      email: email.toLowerCase(),
      password,
      status: "active",
    });

    if (!user) return res.status(401).json({ error: "Invalid credentials" });

    res.json({
      _id: user._id,
      email: user.email,
      name: user.name,
      role: user.role,
      status: user.status,
    });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

app.get("/", (_req, res) => res.json({ ok: true }));

// ✅ mount API

app.use("/api", customerRoutes);
app.use("/api", ticketCategoriesRoutes);
app.use("/api/animals", animalRoutes);
app.use("/api/exhibits", exhibitRoutes);

// ===== START SERVER =====
const PORT = process.env.PORT || 4000;
connectDB().then(() =>
  app.listen(PORT, () => console.log(`🚀 http://localhost:${PORT}`))
);
