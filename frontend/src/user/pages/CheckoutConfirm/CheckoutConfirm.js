import React, { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { FaTrashAlt } from "react-icons/fa";
import SiteHeader from "../../components/SiteHeader/SiteHeader";
import "./CheckoutConfirm.css";

const API_BASE =
  import.meta?.env?.VITE_API_URL || process.env.REACT_APP_API_URL || "";

export default function CheckoutConfirm() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const rid = searchParams.get("rid");

  const [items, setItems] = useState([]);
  const [expiresAt, setExpiresAt] = useState(null);
  const [remaining, setRemaining] = useState(0);
  const [expired, setExpired] = useState(false);
  const [discountCode, setDiscountCode] = useState("");
  const [discount, setDiscount] = useState(0);
  const [selectedPayment, setSelectedPayment] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // --- Fetch reservation ---
  useEffect(() => {
    if (!rid) return;
    (async () => {
      try {
        setLoading(true);
        const res = await fetch(`${API_BASE}/api/reservations/${rid}`);
        const data = await res.json();
        if (!res.ok) throw new Error(data?.error || "Không tải được dữ liệu giữ chỗ.");

        const ticketList = [
          data.quantities.adult > 0 && {
            id: "adult",
            name: `${data.quantities.adult}x Vé Người Lớn`,
            price: data.prices?.adult || 100000,
            qty: data.quantities.adult,
          },
          data.quantities.child > 0 && {
            id: "child",
            name: `${data.quantities.child}x Vé Trẻ Em & Người Già`,
            price: data.prices?.child || 40000,
            qty: data.quantities.child,
          },
          data.quantities.student > 0 && {
            id: "student",
            name: `${data.quantities.student}x Vé Học Sinh & Sinh Viên`,
            price: data.prices?.student || 60000,
            qty: data.quantities.student,
          },
        ].filter(Boolean);

        setItems(ticketList);
        setExpiresAt(new Date(data.expiresAt));
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    })();
  }, [rid]);

  // --- Countdown timer ---
  useEffect(() => {
    if (!expiresAt) return;
    const timer = setInterval(() => {
      const diff = Math.max(0, Math.floor((new Date(expiresAt) - new Date()) / 1000));
      setRemaining(diff);
      if (diff <= 0) {
        setExpired(true);
        clearInterval(timer);
      }
    }, 1000);
    return () => clearInterval(timer);
  }, [expiresAt]);

  // --- Discount logic ---
  const total = items.reduce((sum, i) => sum + i.price * (i.qty || 1), 0);
  const finalTotal = Math.max(0, total - discount);

  const handleApplyDiscount = async () => {
    if (!discountCode.trim()) return alert("Vui lòng nhập mã giảm giá");
    try {
      const res = await fetch(
        `${API_BASE}/api/discounts/validate?code=${encodeURIComponent(discountCode)}&amount=${total}`
      );
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Mã không hợp lệ");
      setDiscount(data.value || 0);
      alert(data.message);
    } catch (err) {
      alert(err.message);
      setDiscount(0);
    }
  };

  const fmtTime = (s) => {
    const m = Math.floor(s / 60);
    const sec = s % 60;
    return `${m.toString().padStart(2, "0")}:${sec.toString().padStart(2, "0")}`;
  };
  // --- Handle xóa vé ---
  const handleRemoveItem = async (id) => {
    const updated = items.filter((i) => i.id !== id);
    setItems(updated);

    if (!rid) return;

    // Nếu vẫn còn vé => cập nhật lại quantities trong DB
    if (updated.length > 0) {
      const newQuantities = {
        adult: updated.find((i) => i.id === "adult")?.qty || 0,
        child: updated.find((i) => i.id === "child")?.qty || 0,
        student: updated.find((i) => i.id === "student")?.qty || 0,
      };

      await fetch(`${API_BASE}/api/reservations/update/${rid}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ quantities: newQuantities }),
      });
    } else {
      // Không còn vé nào → hủy luôn reservation
      await fetch(`${API_BASE}/api/reservations/cancel/${rid}`, { method: "PATCH" });
    }
  };


  // --- Handle chọn phương thức thanh toán ---
  const handleSelectPayment = (method) => {
    setSelectedPayment(method);
  };

  return (
    <>
      <SiteHeader />
      <div className="zozo-checkout-page">
        <div className="zozo-checkout-breadcrumb">
          <span>Chọn vé</span>›<span>Chọn ngày</span>›
          <span className="active">Giỏ hàng & Thanh toán</span>
        </div>

        <div className="zozo-checkout-container">
          <h1>Xác nhận đơn hàng của bạn nhé!</h1>

          {loading && <p style={{ color: "#ccc" }}>Đang tải dữ liệu...</p>}
          {error && <p style={{ color: "#ff7675" }}>⚠ {error}</p>}

          {!loading && !error && (
            <>
              <div className="zozo-checkout-order-box">
                {items.map((item) => (
                  <div key={item.id} className="zozo-checkout-item">
                    <span className="zozo-checkout-item-name">{item.name}</span>
                    <div className="zozo-checkout-item-actions">
                      <span className="zozo-checkout-item-price">
                        {(item.price * item.qty).toLocaleString()} VND
                      </span>
                      <button className="zozo-checkout-item-remove" 
                      onClick={() => handleRemoveItem(item.id)}
                      >
                        <FaTrashAlt />
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              <div className="zozo-checkout-discount">
                <input
                  type="text"
                  placeholder="Nhập mã giảm giá của bạn"
                  value={discountCode}
                  onChange={(e) => setDiscountCode(e.target.value)}
                />
                <button onClick={handleApplyDiscount}>SỬ DỤNG MÃ</button>
              </div>

              <div className="zozo-checkout-total">
                <p>Tổng</p>
                <p className="price">{finalTotal.toLocaleString()} VND</p>
              </div>
                {discount > 0 && (
                <p style={{ color: "#f6ff3e", fontSize: "14px", textAlign: "right" }}>
                    Mã <strong>{discountCode}</strong> đã áp dụng: Giảm {discount.toLocaleString()} VND
                </p>
                )}
              {/* Thời gian còn lại */}
              {expiresAt && !expired && (
                <div className="zozo-timer-box">
                  <p>Thời gian còn lại để thanh toán</p>
                  <div className="zozo-timer-value">{fmtTime(remaining)}</div>
                </div>
              )}

              {/* Chọn phương thức thanh toán */}
              <div className="zozo-checkout-payment">
                <p>Chọn phương thức thanh toán</p>
                <div className="checkout-payment-img">
                  <img
                    src="/img/zalopay.png"
                    alt="ZaloPay"
                    className={
                      selectedPayment === "zalopay"
                        ? "payment-selected"
                        : selectedPayment
                        ? "payment-dim"
                        : ""
                    }
                    onClick={() => handleSelectPayment("zalopay")}
                  />
                  <img
                    src="/img/vnpay.png"
                    alt="VNPay"
                    className={
                      selectedPayment === "vnpay"
                        ? "payment-selected"
                        : selectedPayment
                        ? "payment-dim"
                        : ""
                    }
                    onClick={() => handleSelectPayment("vnpay")}
                  />
                  <img
                    src="/img/momo.png"
                    alt="MoMo"
                    className={
                      selectedPayment === "momo"
                        ? "payment-selected"
                        : selectedPayment
                        ? "payment-dim"
                        : ""
                    }
                    onClick={() => handleSelectPayment("momo")}
                  />
                </div>
              </div>

              {/* Nút thanh toán */}
              <button
                className={`zozo-checkout-pay-btn ${
                  selectedPayment ? "active" : "disabled"
                }`}
                disabled={!selectedPayment}
              >
                THANH TOÁN
              </button>
            </>
          )}
        </div>

        {/* Popup hết hạn giữ chỗ */}
        {expired && (
          <div className="zozo-expired-overlay">
            <div className="zozo-expired-modal">
              <h2>Bạn đã hết thời gian thanh toán vé</h2>
              <div className="zozo-expired-timer">00:00</div>
              <p>Hãy chọn lại ngày và thanh toán nhé!</p>
              <button onClick={() => navigate("/bookingdate")}>Quay lại</button>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
