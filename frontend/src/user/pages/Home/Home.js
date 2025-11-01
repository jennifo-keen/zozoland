// Home.js
import React, { useState,useEffect } from "react";
import "./Home.css";

export default function Home() {
  const [showVideo, setShowVideo] = useState(false);
  const heroUrl = process.env.PUBLIC_URL + '/hero/hero_home.png';
  const cuteani = process.env.PUBLIC_URL + '/img/cute_ani.png';
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

        // Kỳ vọng mỗi item có: { code, name, basePrice, currency, image?, features: string[] }
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

// format tiền
function formatVND(n) {
  try { return n.toLocaleString("vi-VN") + " VND"; }
  catch { return `${n} VND`; }
}
// Chuẩn hóa code trả về từ API (ví dụ ADULT -> adult)
function normalizeCode(code) {
  return (code || "").toString().trim().toLowerCase();
}
function cardClassByCode(code) {
  switch (normalizeCode(code)) {
    case "adult": return "card--adult";
    case "child": return "card--kid";
    case "student": return "card--student";
    default: return "";
  }
}

function getImageUrl(t) {
  return t?.image || "/img/placeholder-ticket.jpg";
}
  return (
    <div className="home">

      {/* Hero */}
      <section className="hero" id="visit" style={{ '--hero-image': `url(${heroUrl})` }}>
        <div className="zoo-hero__birds" aria-hidden="true">
          <img
            src={process.env.PUBLIC_URL + "decor/birds.svg"}
            alt=""
            className="zoo-hero__birds-img"
          />
        </div>
        <div className="container hero__content">
          <h1 className="hero__title">NƠI THIÊN NHIÊN LÊN TIẾNG</h1>
          <p className="hero__subtitle">
            Khám phá – Trải nghiệm – Gắn kết
          </p>

          <div className="zoo-home__cta-row">
            <a href="#book" className="zoo-home__btn zoo-home__btn--primary">Đặt vé ngay</a>
            <a href="/zooareas" className="zoo-home__btn zoo-home__btn--primary">Khám phá sở thú</a>
          </div>
        </div>
      </section>

      {/* Video */}
      <section className="video" aria-labelledby="videoTitle">
        <div className="container">
          <div className="video__frame" role="button" tabIndex="0"
               onClick={() => setShowVideo(true)}
               onKeyDown={(e) => (e.key === "Enter" ? setShowVideo(true) : null)}
               aria-label="Phát video giới thiệu">
            <button className="video__play" aria-hidden>
              <span>Play</span>
            </button>
          </div>
        </div>

        {/* Simple modal video */}
        {showVideo && (
          <div className="modal" role="dialog" aria-modal="true">
            <div className="modal__backdrop" onClick={() => setShowVideo(false)} />
            <div className="modal__body">
              <button className="modal__close" onClick={() => setShowVideo(false)} aria-label="Đóng video">×</button>
              <video
                className="modal__video"
                controls
                autoPlay
                src=""
                poster=""
              >
                Trình duyệt của bạn không hỗ trợ video.
              </video>
            </div>
          </div>
        )}
      </section>

      {/* Pricing */}
    <section className="pricing" id="book" aria-labelledby="pricingTitle">
        <div className="container">
          <h2 id="pricingTitle" className="section__title">
            Các hạng mục vé tham quan của chúng tôi
          </h2>
          <p className="section__lead">
            Với hơn 30.000 động vật thuộc hơn 500 loài, mỗi chuyến tham quan đều góp vào quỹ bảo tồn.
          </p>

          {loading && <div style={{color:"#cfe"}}>Đang tải vé…</div>}
          {err && <div style={{color:"#ffb"}}>{err}</div>}

          <div className="pricing__grid">
            {tickets.map((t) => (
              <article key={t.code || t.name} className={`card ${cardClassByCode(t.code)}`}>
                <div
                  className="card__media"
                  style={{
                    backgroundImage: `url(${getImageUrl(t)})`,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                  }}
                />
                <div className="card__body">
                  <h3>{t.name}</h3>

                  {/* mô tả lấy trực tiếp từ DB */}
                  {t.features.length > 0 ? (
                    <ul className="checklist">
                      {t.features.map((d, i) => <li key={i}>{d}</li>)}
                    </ul>
                  ) : (
                    <p className="muted">Nội dung đang cập nhật…</p>
                  )}

                  <div className="card__price">{formatVND(t.basePrice)}</div>
                  <button className="btn btn-block">Đặt ngay</button>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* CTA banner */}
      <section className="cta">
        <div className="container">
          <div className="cta__box">
            <img
              src={process.env.PUBLIC_URL + "/img/cute_ani.png"}
              alt="Động vật đáng yêu"
              className="cta__img"
            />
            <div className="cta__text">
              <h3>Tham quan các loài động vật đáng yêu</h3>
              <a href="#book" className="btn btn-pill">Đặt vé ngay</a>
            </div>
          </div>
        </div>
      </section>
      {/* nút đặt vé ngay */}
      <div className="zoo-home__float-book" role="region" aria-label="Đặt lịch tham quan">
        <div className="zoo-home__float-text">
          Đặt lịch tham quan ZozoLand ngay thôi !!!
        </div>
        <a href="#book" className="zoo-home__btn-mini">Đặt vé ngay</a>
      </div>
    </div>
  );
}
