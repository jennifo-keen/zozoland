import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { User } from "../model/schemas/User.js";

const router = express.Router();

// Helper: tạo JWT
function signToken(user) {
  const payload = { sub: user._id, email: user.email, roles: user.roles };
  const secret = process.env.JWT_SECRET;     // <--- phải có giá trị
  const expiresIn = process.env.JWT_EXPIRES || "7d";
  return jwt.sign(payload, secret, { expiresIn });
}

// POST /auth/register
router.post("/register", async (req, res) => {
  try {
    const { fullName, username, email, password } = req.body || {};

    // ----- Validate cơ bản -----
    if (
      !fullName?.trim() ||
      !username?.trim() ||
      !email?.trim() ||
      !password
    ) {
      return res
        .status(400)
        .json({ success: false, message: "Thiếu thông tin bắt buộc." });
    }

    if (username.trim().length < 4) {
      return res
        .status(400)
        .json({ success: false, message: "Tên đăng nhập phải từ 4 ký tự." });
    }

    if (password.length < 6) {
      return res
        .status(400)
        .json({ success: false, message: "Mật khẩu phải từ 6 ký tự." });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim())) {
      return res
        .status(400)
        .json({ success: false, message: "Email không hợp lệ." });
    }

    // ----- Chuẩn hoá -----
    const uname = String(username).toLowerCase().trim();
    const mail = String(email).toLowerCase().trim();

    // ----- Kiểm tra trùng username/email (để trả thông báo rõ ràng) -----
    const existing = await User.findOne({
      $or: [{ username: uname }, { email: mail }],
    }).select("_id username email");

    if (existing) {
      const dupField =
        existing.username === uname ? "Tên đăng nhập" : "Email";
      return res
        .status(409)
        .json({ success: false, message: `${dupField} đã tồn tại.` });
    }

    // ----- Băm mật khẩu -----
    const passwordHash = await bcrypt.hash(password, 10);

    // ----- Tạo user -----
    const user = await User.create({
      fullName: fullName.trim(),
      username: uname,
      email: mail,
      passwordHash,
    });

    // (Tuỳ chọn) Auto-login sau đăng ký
    // const token = signToken(user);

    return res.status(201).json({
      success: true,
      message: "Đăng ký thành công.",
      user: {
        id: user._id,
        fullName: user.fullName,
        username: user.username,
        email: user.email,
      },
      // token,
    });
  } catch (err) {
    // Duplicate key từ unique index của Mongo
    if (err?.code === 11000) {
      const key = Object.keys(err.keyPattern || {})[0] || "";
      const fieldVi = key === "email" ? "Email" : "Tên đăng nhập";
      return res
        .status(409)
        .json({ success: false, message: `${fieldVi} đã tồn tại.` });
    }
    console.error(err);
    return res
      .status(500)
      .json({ success: false, message: "Lỗi máy chủ." });
  }
});

// POST /auth/login
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body || {};
    if (!email || !password) {
      return res
        .status(400)
        .json({ success: false, message: "Thiếu email hoặc mật khẩu." });
    }

    const mail = String(email).toLowerCase().trim();
    const user = await User.findOne({ email: mail, isActive: true });
    if (!user)
      return res
        .status(401)
        .json({ success: false, message: "Email hoặc mật khẩu không đúng." });

    const ok = await bcrypt.compare(password, user.passwordHash);
    if (!ok)
      return res
        .status(401)
        .json({ success: false, message: "Email hoặc mật khẩu không đúng." });

    const token = signToken(user);

    return res.json({
      success: true,
      message: "Đăng nhập thành công.",
      token,
      user: {
        id: user._id,
        fullName: user.fullName,
        username: user.username,
        email: user.email,
        roles: user.roles,
      },
    });
  } catch (err) {
    console.error(err);
    return res
      .status(500)
      .json({ success: false, message: "Lỗi máy chủ." });
  }
});


// Middleware bảo vệ route
export function authRequired(req, res, next) {
  const hdr = req.headers.authorization || "";
  const token = hdr.startsWith("Bearer ") ? hdr.slice(7) : null;
  if (!token) return res.status(401).json({ success: false, message: "Thiếu token." });

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    req.user = payload; // {sub, username, roles}
    next();
  } catch (e) {
    return res.status(401).json({ success: false, message: "Token không hợp lệ." });
  }
}

// GET /auth/me (test bảo vệ)
router.get("/me", authRequired, async (req, res) => {
  const user = await User.findById(req.user.sub).select("_id username fullName roles");
  return res.json({ success: true, user });
});

export default router;
