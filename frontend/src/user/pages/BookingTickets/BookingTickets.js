// src/pages/BookingTickets/BookingTickets.jsx
import React, { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "./BookingTickets.css";
import SiteHeader from "../../components/SiteHeader/SiteHeader";

const API_BASE =
  import.meta?.env?.VITE_API_URL || process.env.REACT_APP_API_URL || "";

/** tiện ích lấy query param */
function useQuery() {
  const { search } = useLocation();
  return useMemo(() => new URLSearchParams(search), [search]);
}

export default function BookingTickets() {
  const navigate = useNavigate();
  const q = useQuery();

  // --- lấy date từ query của trang trước
  const dateISO = q.get("date"); // ví dụ: 2025-11-20T00:00:00.000Z
  const visitDate = useMemo(
    () => (dateISO ? new Date(dateISO) : null),
    [dateISO]
  );

  // --- catalog vé từ DB (động)
  const [catalog, setCatalog] = useState([]); // [{id, code, name, basePrice, remaining, ...}]
  const [dayInfo, setDayInfo] = useState(null); // { totalRemaining }
  const [qty, setQty] = useState({}); // { [code]: number }
  const [loading, setLoading] = useState(false);
  const [holdLoading, setHoldLoading] = useState(false);
  const [error, setError] = useState("");

  // Tải catalog & tồn theo ngày
  useEffect(() => {
    if (!visitDate) return;
    (async () => {
      try {
        setLoading(true);
        const monthStartUTC = new Date(
          Date.UTC(
            visitDate.getUTCFullYear(),
            visitDate.getUTCMonth(),
            visitDate.getUTCDate()
          )
        ).toISOString();

        const url = `${API_BASE}/api/tickets/catalog?date=${encodeURIComponent(
          monthStartUTC
        )}`;
        const res = await fetch(url);
        const data = await res.json();
        if (!res.ok) throw new Error(data?.error || "Không tải được danh mục vé.");

        setCatalog(data.catalog || []);
        setDayInfo({ totalRemaining: data.totalRemaining });

        // init qty theo code = 0
        const init = {};
        (data.catalog || []).forEach((c) => {
          init[c.code] = 0;
        });
        setQty((prev) => (Object.keys(prev).length ? prev : init));
      } catch (e) {
        console.error(e);
        setError(e.message || "Lỗi tải dữ liệu.");
        setCatalog([]);
        setDayInfo(null);
        setQty({});
      } finally {
        setLoading(false);
      }
    })();
  }, [visitDate]);

  // Tổng tiền
  const total = useMemo(() => {
    return catalog.reduce(
      (sum, c) => sum + (qty[c.code] || 0) * (c.basePrice || 0),
      0
    );
  }, [catalog, qty]);

  // format
  const fmtVND = (n) =>
    new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
      maximumFractionDigits: 0,
    }).format(n || 0);

  // kiểm tra có thể tăng thêm 1 vé cho code hay không
  const canInc = (code) => {
    const cat = catalog.find((c) => c.code === code);
    if (!cat) return false;
    // còn lại của hạng
    if ((qty[code] || 0) >= (cat.remaining ?? Infinity)) return false;
    // tổng còn lại trong ngày
    const currentSum = Object.values(qty).reduce((a, b) => a + (b || 0), 0);
    if (dayInfo?.totalRemaining != null && currentSum >= dayInfo.totalRemaining)
      return false;
    return true;
  };

  const adjust = (code, delta) => {
    setQty((prev) => {
      const next = { ...prev, [code]: Math.max(0, (prev[code] || 0) + delta) };

      // clamp theo cat.remaining
      const cat = catalog.find((c) => c.code === code);
      if (cat && next[code] > (cat.remaining ?? Infinity)) {
        next[code] = cat.remaining;
      }

      // clamp theo tổng ngày
      const sum = Object.values(next).reduce((a, b) => a + (b || 0), 0);
      const limit = dayInfo?.totalRemaining ?? Infinity;
      if (sum > limit) {
        next[code] = Math.max(0, next[code] - (sum - limit));
      }
      return next;
    });
  };

  const handleHold = async () => {
    setError("");
    if (!visitDate) {
      setError("Thiếu ngày tham quan.");
      return;
    }
    const totalQty = Object.values(qty).reduce((a, b) => a + (b || 0), 0);
    if (totalQty === 0) {
      setError("Vui lòng chọn ít nhất 1 vé.");
      return;
    }

    // Map code -> 3 field backend dùng (giả định code là adult/child/student)
    const payloadQty = {
      adult: qty.adult || 0,
      child: qty.child || 0,
      student: qty.student || 0,
    };

    try {
      setHoldLoading(true);
      const res = await fetch(`${API_BASE}/api/reservations/hold`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          visitDate: new Date(
            Date.UTC(
              visitDate.getUTCFullYear(),
              visitDate.getUTCMonth(),
              visitDate.getUTCDate()
            )
          ).toISOString(),
          quantities: payloadQty,
        }),
      });
      const data = await res.json();
      if (!res.ok)
        throw new Error(data?.error || "Không giữ chỗ được. Vui lòng thử lại.");

      // qua checkout
      navigate(`/checkout?rid=${data.reservationId}`);
    } catch (e) {
      setError(e.message);
    } finally {
      setHoldLoading(false);
    }
  };

  const displayDate = visitDate
    ? new Intl.DateTimeFormat("vi-VN", {
        timeZone: "UTC",
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      }).format(visitDate)
    : "";

  return (
    <>
      <SiteHeader />
      <div className="tkt-page">
        {/* Steps */}
        <div className="tkt-steps">
          <span>Chọn ngày</span> <span>›</span>
          <span className="is-active">Chọn vé</span> <span>›</span>
          <span>Giỏ hàng & Thanh toán</span>
        </div>

        <h1 className="tkt-title">Bạn chọn hạng vé nào vậy?</h1>

        <div className="tkt-layout">
          {/* LEFT: danh sách vé */}
          <section>
            <h2 className="tkt-section-title">Vé theo ngày</h2>
            <p className="tkt-note">
              *Vé đã mua sẽ không được hoàn trả khi đã thanh toán
            </p>

            {loading && catalog.length === 0 && (
              <div style={{ color: "#cfe9e3", marginBottom: 12 }}>
                Đang tải danh mục vé...
              </div>
            )}

            {!loading && catalog.length === 0 && (
              <div style={{ color: "#cfe9e3" }}>
                Không có hạng vé nào được mở bán cho ngày đã chọn.
              </div>
            )}

            {catalog.map((cat) => (
              <TicketRow
                key={cat.code}
                title={cat.name}
                subtitle={cat.description}
                price={cat.basePrice}
                remaining={cat.remaining}
                value={qty[cat.code] || 0}
                onDec={() => adjust(cat.code, -1)}
                onInc={() => canInc(cat.code) && adjust(cat.code, +1)}
                disabledInc={!canInc(cat.code)}
              />
            ))}
          </section>

          {/* RIGHT: tóm tắt */}
          <aside className="tkt-summary">
            <div className="tkt-datecard">
              <div className="tkt-date">{displayDate || "Chưa chọn ngày"}</div>
              <button className="tkt-change" onClick={() => navigate(-1)}>
                THAY ĐỔI NGÀY
              </button>
            </div>

            <div className="tkt-totalrow">
              <span>Tổng</span>
              <strong>{fmtVND(total)}</strong>
            </div>

            {dayInfo && dayInfo.totalRemaining != null && (
              <div className="tkt-remaining">
                Còn lại hôm đó: <strong>{dayInfo.totalRemaining}</strong> vé
              </div>
            )}

            {error && <div className="tkt-error">{error}</div>}

            <button
              className="tkt-paybtn"
              disabled={
                total <= 0 || holdLoading || loading || !visitDate
              }
              onClick={handleHold}
            >
              {holdLoading ? "Đang giữ chỗ..." : "THANH TOÁN"}
            </button>
          </aside>
        </div>
      </div>
    </>
  );
}

function TicketRow({
  title,
  subtitle,
  price,
  value,
  onDec,
  onInc,
  disabledInc,
  remaining,
}) {
  const fmt = new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
    maximumFractionDigits: 0,
  }).format;

  return (
    <div className="tkt-card">
      <div className="tkt-card__meta">
        <div className="tkt-card__title">{title}</div>
        {subtitle && <div className="tkt-card__subtitle">{subtitle}</div>}
        <div className="tkt-card__price">
          {fmt(price)}{" "}
          {Number.isFinite(remaining) ? (
            <em style={{ opacity: 0.75 }}>· còn {remaining}</em>
          ) : null}
        </div>
      </div>
      <div className="tkt-qty">
        <button
          type="button"
          className="tkt-qty__btn"
          onClick={onDec}
          aria-label="Giảm 1"
        >
          –
        </button>
        <span className="tkt-qty__value">{value}</span>
        <button
          type="button"
          className="tkt-qty__btn"
          onClick={onInc}
          aria-label="Tăng 1"
          disabled={disabledInc}
        >
          +
        </button>
      </div>
    </div>
  );
}
