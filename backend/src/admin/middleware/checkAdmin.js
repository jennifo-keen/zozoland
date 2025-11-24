// middleware/checkAdmin.js

import jwt from "jsonwebtoken";

export default function checkAdmin(req, res, next) {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ message: "No token provided" });
    }

    const token = authHeader.split(" ")[1];

    // Giải mã token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Token không có quyền admin → chặn
    if (!decoded || decoded.role !== "admin") {
      return res.status(403).json({ message: "Admin access only" });
    }

    // Gán user vào req để controller dùng tiếp
    req.user = decoded;

    next();
  } catch (err) {
    console.error("Admin auth error:", err);
    return res.status(401).json({ message: "Invalid or expired token" });
  }
}
