// momoNotify.js
import express from "express";
import { Payment } from "../../model/schemas/Payment.js";
import { Order } from "../../model/schemas/Order.js";
import { Reservation } from "../../model/schemas/Reservation.js";

const momoNotify = express.Router();

momoNotify.post("/notify", async (req, res) => {
  try {
    const data = req.body;
    console.log("MoMo IPN:", data);

    if (data.resultCode !== 0) {
      return res.status(200).json({ message: "Payment failed" });
    }

    const { orderId, amount, transId, extraData } = data;

    // parse extraData
    let parsedExtra = {};
    try {
      parsedExtra = JSON.parse(extraData || "{}");
    } catch (err) {
      console.warn("Cannot parse extraData:", extraData);
    }
    const rid = parsedExtra.rid;
    const userId = parsedExtra.userId;

    // tạo Payment record
    const payment = new Payment({
      provider: "MoMo",
      txnId: transId,
      amount: Number(amount),
      status: "succeeded",
      paidAt: new Date(),
      rawPayload: data
    });
    await payment.save();

    // lấy reservation từ DB
    let reservation = null;
    if (rid) {
      reservation = await Reservation.findById(rid);
    }

    // map quantities -> items
    const items = reservation
      ? [
          reservation.quantities.adult > 0 && {
            categoryCode: "adult",
            quantity: reservation.quantities.adult,
            unitPrice: 100000,
            finalUnitPrice: 100000
          },
          reservation.quantities.child > 0 && {
            categoryCode: "child",
            quantity: reservation.quantities.child,
            unitPrice: 40000,
            finalUnitPrice: 40000
          },
          reservation.quantities.student > 0 && {
            categoryCode: "student",
            quantity: reservation.quantities.student,
            unitPrice: 60000,
            finalUnitPrice: 60000
          }
        ].filter(Boolean)
      : [];

    // tạo Order dựa vào reservation
    const order = new Order({
      userId: userId || reservation?.userId || null,
      visitDate: reservation?.visitDate || new Date(),
      items,
      pricing: {
        baseSubtotal: items.reduce((sum, i) => sum + i.unitPrice * i.quantity, 0),
        discountAmount: reservation?.pricing?.discountAmount || 0,
        totalPayable: Number(amount),
        currency: "VND"
      },
      status: "paid",
      paymentId: payment._id
    });
    await order.save();

    // liên kết Payment -> Order
    payment.orderId = order._id;
    await payment.save();

    // update reservation nếu có
    if (reservation) {
      reservation.status = "confirmed";
      await reservation.save();
    }

    res.status(200).json({ message: "Payment processed successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

export default momoNotify;
