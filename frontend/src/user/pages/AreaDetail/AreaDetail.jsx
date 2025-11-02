import React, { useEffect, useMemo, useState } from "react";
import { useParams, Link } from "react-router-dom";
import "./AreaDetail.css";

export default function AreaDetail() {
  const { idOrSlug } = useParams();

  const [exhibit, setExhibit] = useState(null);
  const [loading, setLoading] = useState(true);

  const [animals, setAnimals] = useState([]);
  const [loadingAnimals, setLoadingAnimals] = useState(true);

  const [moreExhibits, setMoreExhibits] = useState([]);
  const [loadingMore, setLoadingMore] = useState(true);

  const API_BASE = useMemo(
    () => import.meta?.env?.VITE_API_URL || process.env.REACT_APP_API_URL || "",
    []
  );

  // helpers
  const stripHtml = (html) =>
    typeof html === "string" ? html.replace(/<[^>]*>/g, "").trim() : "";
  const pickImage = (ex) =>
    ex?.heroImage || (ex?.galleryImages && ex.galleryImages[0]) || "";

  // 1) Lấy chi tiết khu hiện tại (slug hoặc id)
  useEffect(() => {
    const ac = new AbortController();
    setLoading(true);
    fetch(`${API_BASE}/api/exhibits/${idOrSlug}`, { signal: ac.signal })
      .then((r) => (r.ok ? r.json() : Promise.reject(r)))
      .then((data) => setExhibit(data))
      .catch(() => setExhibit(null))
      .finally(() => setLoading(false));
    return () => ac.abort();
  }, [API_BASE, idOrSlug]);

  // 2) Lấy danh sách động vật trong khu
  useEffect(() => {
    if (!exhibit?._id && !idOrSlug) return;
    const ac = new AbortController();
    setLoadingAnimals(true);
    const key = exhibit?._id || idOrSlug; // backend hỗ trợ cả 2
    fetch(
      `${API_BASE}/api/exhibits/${key}/animals?limit=20&fields=name,slug,heroImage,shortDescription,sciName`,
      { signal: ac.signal }
    )
      .then((r) => (r.ok ? r.json() : Promise.reject(r)))
      .then(({ animals }) => setAnimals(animals || []))
      .catch(() => setAnimals([]))
      .finally(() => setLoadingAnimals(false));
    return () => ac.abort();
  }, [API_BASE, exhibit?._id, idOrSlug]);

  // 3) Lấy thêm “khu khác” để hiển thị khối Khám phá
  useEffect(() => {
    const ac = new AbortController();
    setLoadingMore(true);
    fetch(`${API_BASE}/api/exhibits?active=true&limit=8`, { signal: ac.signal })
      .then((r) => (r.ok ? r.json() : Promise.reject(r)))
      .then((list) => {
        const filtered = Array.isArray(list)
          ? list.filter(
              (ex) =>
                ex?._id !== exhibit?._id &&
                ex?.slug !== exhibit?.slug &&
                ex?.isActive !== false
            )
          : [];
        setMoreExhibits(filtered.slice(0, 4)); // lấy 4 khu
      })
      .catch(() => setMoreExhibits([]))
      .finally(() => setLoadingMore(false));
    return () => ac.abort();
  }, [API_BASE, exhibit?._id, exhibit?.slug]);

  // --- Loading page skeleton ---
  if (loading) {
    return (
      <main className="zlad-page">
        <section className="zlad-hero">
          <div className="zlad-hero__inner">
            <h1 className="zlad-hero__title">Đang tải khu vực…</h1>
          </div>
        </section>
      </main>
    );
  }

  // --- Not found ---
  if (!exhibit) {
    return (
      <main className="zlad-page">
        <section className="zlad-hero">
          <div className="zlad-hero__inner">
            <h1 className="zlad-hero__title">Không tìm thấy khu vực</h1>
            <Link to="/" className="zlad-btn zlad-btn--primary">
              Về trang chủ
            </Link>
          </div>
        </section>
      </main>
    );
  }

  const hero = pickImage(exhibit);

  return (
    <main className="zlad-page">
      {/* HERO */}
      <section className="zlad-hero">
        <div
          className="zlad-hero__bg"
          style={{ backgroundImage: hero ? `url(${hero})` : undefined }}
        />
        <div className="zlad-hero__overlay" />
        <div className="zlad-hero__inner">
          <h1 className="zlad-hero__title">{exhibit.name}</h1>
          {exhibit.shortDescription && (
            <p className="zlad-hero__subtitle">{exhibit.shortDescription}</p>
          )}
          <Link to="/" className="zlad-btn zlad-btn--primary">
            Quay lại
          </Link>
        </div>
      </section>

      {/* INTRO */}
      <section className="zlad-feature">
        <div className="zlad-feature__text">
          <h2 className="zlad-feature__heading">Giới thiệu</h2>
          <p className="zlad-feature__desc">
            {stripHtml(exhibit.description || "")}
          </p>
        </div>
      </section>

      {/* ANIMALS LIST */}
      {!loadingAnimals && animals.length > 0 && (
        <section className="zlad-shelf zlad-shelf--panel">
          <div className="zlad-shelf__head">
            <h3 className="zlad-shelf__title">Các thành viên của ngôi nhà</h3>
            <p className="zlad-shelf__lead">
              Có hơn {animals.length} loài ở trong khu vực này, hãy cùng khám phá nhé
            </p>
          </div>
          <div className="zlad-shelf__rail zlad-shelf__rail--scroll">
            {animals.map((a, i) => {
              const img = a.heroImage || (a.images && a.images[0]) || "";
              return (
                <article className="zlad-card zlad-card--animal" key={a.slug || i}>
                  <div
                    className="zlad-card__media"
                    style={{ backgroundImage: `url(${img})` }}
                  />
                  <div className="zlad-card__info">
                    <h4 className="zlad-card__name">{a.name}</h4>
                    {a.sciName && <div className="zlad-card__sci">{a.sciName}</div>}
                    {a.shortDescription && (
                      <p className="zlad-card__desc">{a.shortDescription}</p>
                    )}
                  </div>
                </article>
              );
            })}
          </div>
        </section>
      )}

      {loadingAnimals && (
        <section className="zlad-shelf zlad-shelf--panel">
          <div className="zlad-shelf__head">
            <h3 className="zlad-shelf__title">Các thành viên của ngôi nhà</h3>
          </div>
          <div className="zlad-shelf__rail zlad-shelf__rail--scroll">
            {Array.from({ length: 5 }).map((_, i) => (
              <article className="zlad-card is-skeleton" key={i}>
                <div className="zlad-card__media" />
                <div className="zlad-card__info">
                  <div className="zlad-skel zlad-skel--lg" />
                  <div className="zlad-skel zlad-skel--sm" />
                </div>
              </article>
            ))}
          </div>
        </section>
      )}

      {/* RELATED AREAS – KHÁM PHÁ CÁC KHU VỰC */}
      <section className="zlzone-areas">
        <h3 className="zlzone-areas__title">Khám phá các khu vực</h3>

        <div className="zlzone-areas__list">
          {(loadingMore ? Array.from({ length: 4 }) : moreExhibits).map((ex, idx) => {
            const align = idx % 2 === 0 ? "left" : "right";
            const img = loadingMore ? "" : pickImage(ex);
            const title = loadingMore ? "" : ex?.name;
            const blurb = loadingMore ? "" : stripHtml(ex?.description || "");
            const href = loadingMore ? "#" : `/areas/${ex?.slug || ex?._id}`;

            return (
              <article
                key={loadingMore ? `ex-sk-${idx}` : ex?._id}
                className={`zlzone-area zlzone-area--${align} ${loadingMore ? "is-skeleton" : ""}`}
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
                  {!loadingMore && (
                    <Link className="zlzone-btn zlzone-btn--pill" to={href}>
                      Xem chi tiết
                    </Link>
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
