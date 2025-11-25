// Home.js
import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Home.css";

export default function Home() {
  const heroUrl = process.env.PUBLIC_URL + '/hero/hero_home.png';
  const navigate = useNavigate();
  const [showVideo, setShowVideo] = useState(false);
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");

  useEffect(() => {
    (async () => {
      try {
        const base = process.env.REACT_APP_API_URL || "";
        const res = await fetch(`${base}/api/ticket-categories`);
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = await res.json();

        const normalized = (Array.isArray(data) ? data : []).map((t) => ({
          ...t,
          code: normalizeCode(t.code),
          features: Array.isArray(t.features) ? t.features : [],
        }));
        setTickets(normalized);
      } catch (e) {
        console.error(e);
        setErr("Không lấy được dữ liệu vé.");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  function formatVND(n) {
    try { return n.toLocaleString("vi-VN") + " VND"; }
    catch { return `${n} VND`; }
  }

  function normalizeCode(code) {
    return (code || "").toString().trim().toLowerCase();
  }

  function cardClassByCode(code) {
    switch (normalizeCode(code)) {
      case "adult": return "zooHomeNew-card--adult";
      case "child": return "zooHomeNew-card--kid";
      case "student": return "zooHomeNew-card--student";
      default: return "";
    }
  }

  const handleBookingClick = (e) => {
    e.preventDefault();
    const token = localStorage.getItem("authToken");
    if (!token) {
      alert("Vui lòng đăng nhập để đặt vé!");
      navigate("/login");
    } else {
      navigate("/bookingdate");
    }
  };

  function getImageUrl(t) {
    return t?.image || "/img/placeholder-ticket.jpg";
  }

  return (
    <div className="zooHomeNew-home">

      {/* Hero */}
      <section className="zooHomeNew-hero" id="visit" style={{ '--hero-image': `url(${heroUrl})` }}>
        <div className="zooHomeNew-hero-birds" aria-hidden="true">
          <img
            src={process.env.PUBLIC_URL + "decor/birds.svg"}
            alt=""
            className="zooHomeNew-hero-birds-img"
          />
        </div>
        <div className="container zooHomeNew-hero-content">
          <h1 className="zooHomeNew-hero-title">NƠI THIÊN NHIÊN LÊN TIẾNG</h1>
          <p className="zooHomeNew-hero-subtitle">Khám phá – Trải nghiệm – Gắn kết</p>

          <div className="zooHomeNew-cta-row">
            <Link onClick={handleBookingClick} className="zooHomeNew-btn zooHomeNew-btn--primary">Đặt vé ngay</Link>
            <Link to="/zooareas" className="zooHomeNew-btn zooHomeNew-btn--primary">Khám phá sở thú</Link>
          </div>
        </div>
      </section>

      {/* Video */}
      <section className="zooHomeNew-video" aria-labelledby="videoTitle">
        <div className="container">
          <div
            className="zooHomeNew-video-frame"
            role="button"
            tabIndex="0"
            onClick={() => setShowVideo(true)}
            onKeyDown={(e) => (e.key === "Enter" ? setShowVideo(true) : null)}
            aria-label="Phát video giới thiệu"
          >
            <button className="zooHomeNew-video-play" aria-hidden>
              <span>Play</span>
            </button>
          </div>
        </div>

        {showVideo && (
          <div className="zooHomeNew-modal" role="dialog" aria-modal="true">
            <div className="zooHomeNew-modal-backdrop" onClick={() => setShowVideo(false)} />
            <div className="zooHomeNew-modal-body">
              <button className="zooHomeNew-modal-close" onClick={() => setShowVideo(false)} aria-label="Đóng video">×</button>
              <video
                className="zooHomeNew-modal-video"
                controls
                autoPlay
                src="https://res.cloudinary.com/dbifhgaic/video/upload/v1759763791/samples/elephants.mp4"
                poster=""
              >
                Trình duyệt của bạn không hỗ trợ video.
              </video>
            </div>
          </div>
        )}
      </section>

      {/* Pricing */}
      <section className="zooHomeNew-pricing" id="book" aria-labelledby="pricingTitle">
        <div className="container">
          <h2 id="pricingTitle" className="zooHomeNew-section-title">
            Các hạng mục vé tham quan của chúng tôi
          </h2>
          <p className="zooHomeNew-section-lead">
            Với hơn 30.000 động vật thuộc hơn 500 loài, mỗi chuyến tham quan đều góp vào quỹ bảo tồn.
          </p>

          {loading && <div style={{ color: "#cfe" }}>Đang tải vé…</div>}
          {err && <div style={{ color: "#ffb" }}>{err}</div>}

          <div className="zooHomeNew-pricing-grid">
            {tickets.map((t) => (
              <article key={t.code || t.name} className={`zooHomeNew-card ${cardClassByCode(t.code)}`}>
                <div
                  className="zooHomeNew-card-media"
                  style={{
                    backgroundImage: `url(${getImageUrl(t)})`,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                  }}
                />
                <div className="zooHomeNew-card-body">
                  <h3>{t.name}</h3>

                  {t.features.length > 0 ? (
                    <ul className="zooHomeNew-checklist">
                      {t.features.map((d, i) => <li key={i}>{d}</li>)}
                    </ul>
                  ) : (
                    <p className="zooHomeNew-muted">Nội dung đang cập nhật…</p>
                  )}

                  <div className="zooHomeNew-card-price">{formatVND(t.basePrice)}</div>
                  <a className="zooHomeNew-btn-block" href="/bookingdate">Đặt ngay</a>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* CTA banner */}
      <section className="zooHomeNew-cta">
        <div className="container">
          <div className="zooHomeNew-cta-box">
            <img
              src={process.env.PUBLIC_URL + "/img/cute_ani.png"}
              alt="Động vật đáng yêu"
              className="zooHomeNew-cta-img"
            />
            <div className="zooHomeNew-cta-text">
              <h3>Tham quan các loài động vật đáng yêu</h3>
              <Link onClick={handleBookingClick} className="zooHomeNew-btn zooHomeNew-btn-pill">Đặt vé ngay</Link>
            </div>
          </div>
        </div>
      </section>

      {/* Floating booking button */}
      <div className="zooHomeNew-float-book" role="region" aria-label="Đặt lịch tham quan">
        <div className="zooHomeNew-float-text">
          Đặt lịch tham quan ZozoLand ngay thôi !!!
        </div>
        <Link onClick={handleBookingClick} className="zooHomeNew-btn-mini">
          Đặt vé ngay
        </Link>
      </div>
    </div>
  );
}
