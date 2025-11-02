import React, { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import "./ZooAreas.css"; // hoặc file css chứa các class zlzone-*

export default function AreasSection({ exhibits = [], loading = false }) {
  const navigate = useNavigate();

  const exhibitPlaceholders = useMemo(() => Array.from({ length: 4 }), []);

  const stripHtml = (html) =>
    typeof html === "string" ? html.replace(/<[^>]*>/g, "").trim() : "";

  const pickImage = (ex) =>
    ex?.heroImage || (ex?.galleryImages && ex.galleryImages[0]) || "";

  return (
    <section className="zlzone-areas">
      <h3 className="zlzone-areas__title">Khám phá các khu vực</h3>

      <div className="zlzone-areas__list">
        {(loading ? exhibitPlaceholders : exhibits).map((ex, idx) => {
          const align = idx % 2 === 0 ? "left" : "right";
          const img = loading ? "" : pickImage(ex);
          const title = loading ? "" : ex.name;
          const blurb = loading ? "" : stripHtml(ex.description || "");

          return (
            <article
              key={loading ? `ex-sk-${idx}` : ex._id}
              className={`zlzone-area zlzone-area--${align} ${loading ? "is-skeleton" : ""}`}
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
                {!loading && (
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
  );
}
