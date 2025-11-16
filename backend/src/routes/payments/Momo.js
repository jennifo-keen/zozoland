import express from "express";
import crypto from "crypto";
import https from "https";

const momo = express.Router();

momo.post("/", async (req, res) => {
  try {
    const { amount, rid } = req.body; // lấy amount + rid từ frontend
    if (!amount || !rid) return res.status(400).json({ error: "Thiếu amount hoặc rid" });

    const partnerCode = "MOMO";
    const accessKey = "F8BBA842ECF85";
    const secretKey = "K951B6PE1waDMi640xX08PD3vg6EkVlz";
    const requestId = partnerCode + Date.now();
    const orderId = rid; // gán rid làm orderId
    const orderInfo = "Thanh toán vé Zozoland";
    const redirectUrl = `http://localhost:3000/checkout?rid=${rid}`;
    // frontend nhận redirect
    const ipnUrl = "https://mae-blastoporic-zetta.ngrok-free.dev/api/payments/momo/notify";
    const requestType = "captureWallet";
    const extraData = "";

    // Tạo signature
    const rawSignature =
      `accessKey=${accessKey}&amount=${amount}&extraData=${extraData}` +
      `&ipnUrl=${ipnUrl}&orderId=${orderId}&orderInfo=${orderInfo}` +
      `&partnerCode=${partnerCode}&redirectUrl=${redirectUrl}` +
      `&requestId=${requestId}&requestType=${requestType}`;

    const signature = crypto
      .createHmac("sha256", secretKey)
      .update(rawSignature)
      .digest("hex");

    // Tạo request body gửi MoMo
    const requestBody = {
      partnerCode,
      accessKey,
      requestId,
      amount,
      orderId,
      orderInfo,
      redirectUrl,
      ipnUrl,
      extraData,
      requestType,
      signature,
      lang: "en",
    };

    console.log("--------------------REQUEST BODY----------------");
    console.log(requestBody);

    // Gửi request tới MoMo test endpoint
    const options = {
      hostname: "test-payment.momo.vn",
      port: 443,
      path: "/v2/gateway/api/create",
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Content-Length": Buffer.byteLength(JSON.stringify(requestBody)),
      },
    };

    const request = https.request(options, (response) => {
      let data = "";
      response.on("data", (chunk) => (data += chunk));
      response.on("end", () => {
        try {
          const result = JSON.parse(data);
          // trả về frontend link thanh toán
          if (result.payUrl) {
            res.status(200).json({ payUrl: result.payUrl });
          } else {
            res.status(400).json({ error: result.message || "Không lấy được link MoMo" });
          }
        } catch (err) {
          res.status(500).json({ error: "Lỗi phân tích dữ liệu từ MoMo" });
        }
      });
    });

    request.on("error", (e) => {
      console.error(e);
      res.status(500).json({ error: e.message });
    });

    request.write(JSON.stringify(requestBody));
    request.end();
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

export default momo;
