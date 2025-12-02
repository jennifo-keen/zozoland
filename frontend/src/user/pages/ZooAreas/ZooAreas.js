import React, { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./ZooAreas.css";

export default function ZooAreas() {
  const navigate = useNavigate();
  const [exhibits, setExhibits] = useState([]);
  const [loadingEx, setLoadingEx] = useState(true);

  const [animals, setAnimals] = useState([]);
  const [loadingAnimals, setLoadingAnimals] = useState(true);

  const zooareas = process.env.PUBLIC_URL + "/img/Meerkat.png";
  const birds = process.env.PUBLIC_URL + "/img/Hornbill_Birds.png";

  const API_BASE = process.env.REACT_APP_API_URL || "";

  console.log(API_BASE)

  const stripHtml = (html) =>
    typeof html === "string" ? html.replace(/<[^>]*>/g, "").trim() : "";

  const pickImage = (ex) =>
    ex?.heroImage || (ex?.galleryImages && ex.galleryImages[0]) || "";

  // fetch 5 animals ngẫu nhiên (đã làm trước đó)
  useEffect(() => {
    const ac = new AbortController();
    setLoadingAnimals(true);
    fetch(`${API_BASE}/api/animals/random?limit=5`, { signal: ac.signal })
      .then((r) => r.json())
      .then((data) => setAnimals(Array.isArray(data) ? data : []))
      .catch((e) => e.name !== "AbortError" && console.error(e))
      .finally(() => setLoadingAnimals(false));
    return () => ac.abort();
  }, [API_BASE]);

  useEffect(() => {
    const ac = new AbortController();
    setLoadingEx(true);
    fetch(`${API_BASE}/api/exhibits?active=true&limit=6`, { signal: ac.signal })
      .then((r) => r.json())
      .then((data) => setExhibits(Array.isArray(data) ? data : []))
      .catch((e) => e.name !== "AbortError" && console.error(e))
      .finally(() => setLoadingEx(false));
    return () => ac.abort();
  }, [API_BASE]);

  const animalPlaceholders = new Array(5).fill(null);
  const exhibitPlaceholders = new Array(3).fill(null);

  const getAnimalImage = (a) =>
    a?.thumbnail || a?.heroImage || `${process.env.PUBLIC_URL}/img/placeholder.jpg`;

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
  return (
    <main className="zlzone-page">
      {/* HERO */}
      <section className="zlzone-hero">
        <div className="zlzone-hero__bg" style={{ "--zooareas-image": `url(${zooareas})` }} />
        <div className="zlzone-hero__overlay" />
        <div className="zlzone-hero__inner">
          <h1 className="zlzone-hero__title">CHI TIẾT CÁC KHU VỰC</h1>
          <p className="zlzone-hero__subtitle">Ngôi nhà của muôn loài</p>
          <Link onClick={handleBookingClick} className="zlzone-btn zlzone-btn--primary">Đặt vé ngay </Link>
        </div>
      </section>

      {/* ảnh chính */}
      <section className="zlzone-feature">
        <div className="zlzone-feature__media" style={{ "--bird-image": `url(${birds})` }} />
        <div className="zlzone-feature__text">
          <h2 className="zlzone-feature__heading">Có hơn 1.000 loài</h2>
          <p className="zlzone-feature__desc">
            Zozoland là nơi sinh sống của vô số loài động vật, nhiều loài trong số
            đó đang bị đe dọa. Những nỗ lực bảo tồn mà chúng tôi hỗ trợ đóng vai trò
            quan trọng cho sự sống còn của chúng.
          </p>
        </div>
      </section>

      {/* Hiện các động vật ngẫu nhiên */}
      <section className="zlzone-shelf zlzone-shelf--panel zlzone-shelf--full">
        <div className="zlzone-shelf__head">
          <h3 className="zlzone-shelf__title">Gặp gỡ hơn 500 loài trong chuyến thăm tiếp theo của bạn</h3>
          <p className="zlzone-shelf__lead">
            Từ những loài khổng lồ trên thảo nguyên đến những loài nhỏ bé có vai trò quan trọng trong hệ sinh thái.
          </p>
        </div>

        <div className="zlzone-shelf__rail">
          {loadingAnimals
            ? animalPlaceholders.map((_, i) => (
              <article className="zlzone-card is-skeleton" key={`ask-${i}`}>
                <div className="zlzone-card__media" />
                <div className="zlzone-card__info">
                  <div className="zlzone-card__name" />
                  <div className="zlzone-card__sci" />
                </div>
              </article>
            ))
            : animals.map((a) => (
              <article className="zlzone-card" key={a._id}>
                <div className="zlzone-card__media" style={{ backgroundImage: `url(${getAnimalImage(a)})` }} />
                <div className="zlzone-card__info">
                  <div className="zlzone-card__name">{a.commonName}</div>
                  <div className="zlzone-card__sci">{a.scientificName}</div>
                </div>
              </article>
            ))}
        </div>
      </section>

      {/* Hiện danh sách khu */}
      <section className="zlzone-areas">
        <h3 className="zlzone-areas__title">Khám phá các khu vực</h3>

        <div className="zlzone-areas__list">
          {(loadingEx ? exhibitPlaceholders : exhibits).map((ex, idx) => {
            const align = idx % 2 === 0 ? "left" : "right";
            const img = loadingEx ? "" : pickImage(ex);
            const title = loadingEx ? "" : ex.name;
            const blurb = loadingEx ? "" : stripHtml(ex.description || "");

            return (
              <article
                key={loadingEx ? `ex-sk-${idx}` : ex._id}
                className={`zlzone-area zlzone-area--${align} ${loadingEx ? "is-skeleton" : ""}`}
              >
                <div
                  className="zlzone-area__bg"
                  style={{ backgroundImage: img ? `url(${img})` : undefined }}
                  aria-hidden="true"
                />
                <div className="zlzone-area__overlay" />
                <div className="zlzone-area__content">
                  <h4 className="zlzone-area__heading">{title || " "}</h4>
                  <p className="zlzone-area__blurb">{blurb || " "}</p>
                  {!loadingEx && (
                    <button
                      className="zlzone-btn zlzone-btn--pill"
                      onClick={() => navigate(`/areas/${ex?.slug || ex?._id}`)}
                    >
                      Xem chi tiết
                    </button>
                  )}
                </div>
              </article>
            );
          })}
        </div>
      </section>
    </main>
  );
}
