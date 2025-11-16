import express from "express";
import crypto from "crypto";

const vnpay = express.Router();

vnpay.post("/", (req, res) => {
  const { amount, rid } = req.body;
  if (!amount || !rid) return res.status(400).json({ error: "Thiếu amount hoặc rid" });

  const vnpUrl = "https://sandbox.vnpayment.vn/paymentv2/vpcpay.html";
  const vnp_TmnCode = "YOUR_TMN_CODE";
  const vnp_HashSecret = "YOUR_SECRET_KEY";
  const vnp_ReturnUrl = `http://localhost:3000/checkout?rid=${rid}`;

  const createDate = new Date().toISOString().replace(/[-:T]/g, "").slice(0, 14);
  const vnp_TxnRef = rid;

  let vnp_Params = {
    vnp_Version: "2.1.0",
    vnp_Command: "pay",
    vnp_TmnCode,
    vnp_Amount: amount * 100, // VNPay nhân 100
    vnp_CurrCode: "VND",
    vnp_TxnRef,
    vnp_OrderInfo: "Thanh toán vé Zozoland",
    vnp_Locale: "vn",
    vnp_ReturnUrl,
    vnp_CreateDate: createDate,
  };

  // Tạo chữ ký
  const signData = Object.keys(vnp_Params)
    .sort()
    .map((key) => `${key}=${vnp_Params[key]}`)
    .join("&");

  const vnp_SecureHash = crypto.createHmac("sha512", vnp_HashSecret).update(signData).digest("hex");
  vnp_Params.vnp_SecureHash = vnp_SecureHash;

  const queryString = new URLSearchParams(vnp_Params).toString();
  res.json({ payUrl: `${vnpUrl}?${queryString}` });
});

export default vnpay;
