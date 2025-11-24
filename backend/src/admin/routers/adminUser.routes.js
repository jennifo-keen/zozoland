import express from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { AdminUser } from "../../model/schemas/AdminUser.js";

const router = express.Router();

router.post("/login", async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({
        success: false,
        message: "Vui lòng nhập đầy đủ thông tin!"
      });
    }

    const user = await AdminUser.findOne({ email: username });

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Email không tồn tại!"
      });
    }

    if (user.status === "blocked") {
      return res.status(403).json({
        success: false,
        message: "Tài khoản đã bị khóa!"
      });
    }

    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Mật khẩu không đúng!"
      });
    }

    const token = jwt.sign(
      {
        id: user._id,
        role: user.role,
      },
      process.env.JWT_SECRET || "zozoland",
      { expiresIn: "7d" }
    );

    const id = user._id;
    const update = await AdminUser.updateOne(
    { _id: id }, 
    { updatedAt: new Date() }  
    );


    return res.json({
      success: true,
      message: "Đăng nhập thành công!",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        status: user.status,
      }
    });
  } catch (err) {
    console.error("Đăng nhập thất bại:", err);
    return res.status(500).json({
      success: false,
      message: "Lỗi server!"
    });
  }
});

router.get("/profile", async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader)
      return res.status(401).json({ success: false, message: "Không có token!" });

    const token = authHeader.split(" ")[1];

    const decoded = jwt.verify(token, process.env.JWT_SECRET || "super-secret-key");
    const user = await AdminUser.findById(decoded.id).select("-passwordHash");

    if (!user)
      return res.status(404).json({ success: false, message: "Không tìm thấy user!" });

    res.json({ success: true, user });

  } catch (err) {
    console.error("Profile error:", err);
    res.status(401).json({ success: false, message: "Token không hợp lệ!" });
  }
});

router.get("/admin", async (req, res) => {
    try {
        const data = await AdminUser.find({})

        if (data.length == 0) {
            res.status(400).json({success: false, message: "Không có dữ liệu"})
        }

        res.status(200).json({
            success:true,
            data: data,
            message: "Lấy dữ liệu quản trị viên thành công!"
        })
    }
    catch (err) {
        console.error("Lỗi lấy dữ liệu", err);
        return res.status(500).json({
        success: false,
        message: "Lỗi server!"
        });
    }
})

router.get("/admin/:id", async (req, res) => {
    try {
        const {id} = req.params
        const data = await AdminUser.findOne({_id: id})

        if (data.length == 0) {
            res.status(400).json({success: false, message: "Không có dữ liệu"})
        }

        res.status(200).json({
            success:true,
            data: data,
            message: "Lấy dữ liệu quản trị viên thành công!"
        })
    }
    catch (err) {
        console.error("Lỗi lấy dữ liệu", err);
        return res.status(500).json({
        success: false,
        message: "Lỗi server!"
        });
    }
})

router.delete("/admin/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const admin = await AdminUser.findById(id);

    if (!admin) {
      return res.status(404).json({
        success: false,
        message: "Không tìm thấy admin!"
      });
    }

    await AdminUser.deleteOne({ _id: id });

    res.status(200).json({
      success: true,
      message: "Xóa admin thành công!",
    });
  } catch (err) {
    console.error("Lỗi xóa admin", err);
    return res.status(500).json({
      success: false,
      message: "Lỗi server!"
    });
  }
});

router.put("/admin/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { name, email, role, note } = req.body;

    const admin = await AdminUser.findById(id);
    if (!admin) {
      return res.status(404).json({
        success: false,
        message: "Không tìm thấy admin!"
      });
    }

    if (name !== undefined) admin.name = name;
    if (email !== undefined) admin.email = email;
    if (role !== undefined) admin.role = role;
    if (note !== undefined) admin.note = note;

    await admin.save();

    res.status(200).json({
      success: true,
      message: "Cập nhật admin thành công!",
      data: admin
    });
  } catch (err) {
    console.error("Lỗi cập nhật admin", err);
    res.status(500).json({
      success: false,
      message: "Lỗi server!"
    });
  }
});


router.post("/admin", async (req, res) => {
  try {
    const { name, email, password, role, note } = req.body;

    if (!name || !email || !password || !role) {
      return res.status(400).json({
        success: false,
        message: "Vui lòng nhập đầy đủ thông tin!"
      });
    }

    const existing = await AdminUser.findOne({ email });
    if (existing) {
      return res.status(400).json({
        success: false,
        message: "Email đã tồn tại!"
      });
    }

    const passwordHash = await bcrypt.hash(password, 10);

    const newAdmin = new AdminUser({
      name,
      email,
      passwordHash,
      role,
      note: note || "",
      status: "active",
      createdAt: new Date()
    });

    await newAdmin.save();

    res.status(201).json({
      success: true,
      message: "Thêm quản trị viên thành công!",
    });
  } catch (err) {
    console.error("Lỗi thêm admin:", err);
    res.status(500).json({
      success: false,
      message: "Lỗi server!"
    });
  }
});


export default router;
