import express from "express";
import crypto from "crypto";
import https from "https";
import querystring from "querystring";

const zalopay = express.Router();

zalopay.post("/", (req, res) => {
  const { amount, rid } = req.body;
  if (!amount || !rid)
    return res.status(400).json({ error: "Thiếu amount hoặc rid" });

  const appId = "553"; // sandbox appId của cậu
  const key1 = "9phuAOYhan4urywHTh0ndEXiV3pKHr5Q";
  const key2 = "Iyz2habzyr7AG8SgvoBCbKwKi3UzlLi3";
  const endpoint = "https://sandbox.zalopay.com.vn/v001/tpe/createorder";

  // tạo app_trans_id theo chuẩn yyMMdd_random
  const date = new Date();
  const yy = String(date.getFullYear()).slice(-2);
  const MM = String(date.getMonth() + 1).padStart(2, "0");
  const dd = String(date.getDate()).padStart(2, "0");
  const random = Math.floor(Math.random() * 10000);
  const app_trans_id = `${yy}${MM}${dd}_${random}`;

  // embeddata & item phải stringify JSON
  const embed_data = JSON.stringify({ merchantinfo: "demo" });
  const item = JSON.stringify([{ itemid: "knb", itemname: "kim nguyen bao", itemprice: amount, itemquantity: 1 }]);

  const order = {
    appid: appId,
    apptransid: app_trans_id,
    apptime: Date.now(),
    appuser: "demo",
    amount,
    description: "Thanh toán vé Zozoland",
    bankcode: "zalopayapp",
    item,
    embed_data,
    callbackurl: `http://localhost:3000/checkout?rid=${rid}`, // test localhost
  };

  // tạo mac theo thứ tự yêu cầu của ZaloPay
  const raw = `${order.appid}|${order.apptransid}|${order.appuser}|${order.amount}|${order.apptime}|${order.embed_data}|${order.item}`;
  order.mac = crypto.createHmac("sha256", key1).update(raw).digest("hex");

  // convert sang x-www-form-urlencoded
  const postData = querystring.stringify(order);

  const reqOptions = {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      "Content-Length": Buffer.byteLength(postData),
    },
  };

  const request = https.request(endpoint, reqOptions, (response) => {
    let data = "";
    response.on("data", (chunk) => (data += chunk));
    response.on("end", () => {
      try {
        const result = JSON.parse(data);
        if (result.zp_trans_url) res.json({ payUrl: result.zp_trans_url });
        else res.status(400).json({ error: result.returnmessage || "Không lấy được link ZaloPay" });
      } catch (err) {
        res.status(500).json({ error: "Lỗi phân tích dữ liệu từ Zalopay" });
      }
    });
  });

  request.on("error", (err) => res.status(500).json({ error: err.message }));
  request.write(postData);
  request.end();
});

export default zalopay;
