import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./BookingDate.css";
import { buildMonthMatrixUTC } from "../../components/calendar/calendar.js";
import SiteHeader from "../../components/SiteHeader/SiteHeader.js";

const API_BASE =
  import.meta?.env?.VITE_API_URL || process.env.REACT_APP_API_URL || "";

export default function BookingDate() {
  const navigate = useNavigate();

  // Tháng động: đầu tháng theo UTC
  const [cursor, setCursor] = useState(() => {
    const now = new Date();
    return new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), 1));
  });

  const [availability, setAvailability] = useState([]); // mảng từ API
  const [loading, setLoading] = useState(false);
  const [selected, setSelected] = useState(null);
  const [selectedInfo, setSelectedInfo] = useState(null);

  const weeks = useMemo(
    () =>
      buildMonthMatrixUTC(
        cursor.getUTCFullYear(),
        cursor.getUTCMonth() + 1,
        true
      ),
    [cursor]
  );

  // fetch availability khi đổi tháng
  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        const url = `${API_BASE}/api/tickets/availability?date=${encodeURIComponent(
          cursor.toISOString()
        )}`;
        const res = await fetch(url);
        const data = await res.json();
        setAvailability(data);
      } catch (e) {
        console.error(e);
        setAvailability([]);
      } finally {
        setLoading(false);
      }
    })();
  }, [cursor]);

  // map yyyy-mm-dd -> info
  const mapAvail = useMemo(() => {
    const pad = (n) => (n < 10 ? `0${n}` : `${n}`);
    const map = new Map();
    for (const it of availability) {
      const d = new Date(it.date);
      const key = `${d.getUTCFullYear()}-${pad(
        d.getUTCMonth() + 1
      )}-${pad(d.getUTCDate())}`;
      map.set(key, it);
    }
    return map;
  }, [availability]);

  const monthName = new Intl.DateTimeFormat("en", {
    month: "long",
    timeZone: "UTC",
  }).format(cursor);
  const year = cursor.getUTCFullYear();

  const stepMonth = (delta) => {
    setCursor((prev) => {
      const d = new Date(prev);
      d.setUTCMonth(d.getUTCMonth() + delta);
      return d;
    });
    setSelected(null);
    setSelectedInfo(null);
  };

  const pad = (n) => (n < 10 ? `0${n}` : `${n}`);
  const keyOf = (d) =>
    `${d.getUTCFullYear()}-${pad(d.getUTCMonth() + 1)}-${pad(
      d.getUTCDate()
    )}`;

  return (
    <>
      <SiteHeader />
      <div className="bkdp-page">
        <div className="bkdp-steps">
          <span className="is-active">Chọn ngày</span>
          <span>›</span>
          <span>Chọn vé</span>
          <span>›</span>
          <span>Giỏ hàng &amp; Thanh toán</span>
        </div>

        <h1 className="bkdp-title">Khi nào bạn có thể đến?</h1>

        <div className="bkdp-layout">
          {/* LEFT: calendar */}
          <section className="bkdp-calendar">
            <header className="bkdp-cal-head" aria-live="polite">
              <button className="bkdp-nav" onClick={() => stepMonth(-1)}>
                ‹
              </button>
              <div className="bkdp-month">
                {monthName}
                <span className="bkdp-diamond">◆</span>
                {year}
              </div>
              <button className="bkdp-nav" onClick={() => stepMonth(1)}>
                ›
              </button>
            </header>

            <div className="bkdp-weekdays">
              <span>Mo</span>
              <span>Tu</span>
              <span>We</span>
              <span>Th</span>
              <span>Fr</span>
              <span>Sa</span>
              <span>Su</span>
            </div>

            <div className="bkdp-grid" role="grid" aria-busy={loading}>
              {weeks.map((row, rIdx) => (
                <div className="bkdp-row" role="row" key={`r-${rIdx}`}>
                  {row.map((cell, cIdx) => {
                    if (!cell)
                      return (
                        <span
                          key={`e-${rIdx}-${cIdx}`}
                          className="bkdp-cell is-empty"
                        />
                      );

                    const k = keyOf(cell);
                    const info = mapAvail.get(k);
                    const available = info?.available === true; // default false nếu thiếu bản ghi
                    const dNum = cell.getUTCDate();
                    const isSelected =
                      selected && selected.getTime() === cell.getTime();

                    return (
                      <button
                        key={`d-${k}`}
                        type="button"
                        className={[
                          "bkdp-cell",
                          "bkdp-day",
                          available ? "is-value" : "is-unavailable",
                          isSelected ? "is-selected" : "",
                        ].join(" ")}
                        disabled={!available}
                        onClick={() => {
                          if (available) {
                            setSelected(cell);
                            setSelectedInfo(info);
                          }
                        }}
                        title={
                          available
                            ? `Còn vé: ${info?.remaining ?? "?"}/${
                                info?.totalCapacity ?? "?"
                              }`
                            : "Hết vé / Không mở bán"
                        }
                        aria-label={`Ngày ${dNum}/${
                          cell.getUTCMonth() + 1
                        }/${cell.getUTCFullYear()} - ${
                          available ? "còn vé" : "hết vé"
                        }`}
                      >
                        {dNum}
                      </button>
                    );
                  })}
                </div>
              ))}
            </div>

            <div className="bkdp-legend">
              <LegendDot tone="value" label="Còn vé" />
              <LegendDot tone="unavailable" label="Unavailable" />
            </div>
          </section>

          {/* RIGHT: notes & selection */}
          <aside className="bkdp-notes">
            <ul>
              <li>Chúng tôi chỉ cho phép đặt ngày còn vé trên lịch.</li>
              <li>Vé đã mua không hoàn tiền dưới bất kỳ hình thức nào.</li>
              <li>
                Nếu thời tiết xấu bạn có thể xin hỗ trợ đổi ngày (tùy tình
                trạng chỗ trống).
              </li>
            </ul>

            {selected &&
              (() => {
                const d = selected.getUTCDate();
                const m = selected.getUTCMonth() + 1;
                const y = selected.getUTCFullYear();
                return (
                  <>
                    <p style={{ marginTop: 16, color: "#cfe9e3" }}>
                      Bạn đã chọn:{" "}
                      <strong>
                        {pad(d)}/{pad(m)}/{y}
                      </strong>
                    </p>

                    <div className="bkdp-selectedinfo">
                      <p style={{ margin: "8px 0", color: "#cfe9e3" }}>
                        <strong>Số vé còn lại:</strong>{" "}
                        {selectedInfo?.remaining ?? "—"} /{" "}
                        {selectedInfo?.totalCapacity ?? "—"}
                      </p>

                      <button
                        className="next-step-btn"
                        disabled={!selected || !selectedInfo}
                        onClick={() =>
                          navigate(
                            `/booking/tickets?date=${selected.toISOString()}`
                          )
                        }
                      >
                        Tiếp tục
                      </button>
                    </div>
                  </>
                );
              })()}
          </aside>
        </div>
      </div>
    </>
  );
}

function LegendDot({ tone, label }) {
  return (
    <span className="bkdp-legend__item">
      <span className={`bkdp-dot dot-${tone}`} aria-hidden="true" />
      <span>{label}</span>
    </span>
  );
}
