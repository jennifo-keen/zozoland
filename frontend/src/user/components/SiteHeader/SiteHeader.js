import React from "react";
import { Link, useNavigate } from "react-router-dom";
import "./SiteHeader.css";

export default function SiteHeader() {
  const navigate = useNavigate();
  // Đổi đường dẫn logo theo dự án của bạn:
  const LOGO = process.env.PUBLIC_URL + "/logo_white.svg";

  return (
    <header className="zl-header">
      <div className="zl-header__inner">
        <button
          className="zl-logo"
          onClick={() => navigate("/")}
          aria-label="Về trang chủ"
        >
          <img src={LOGO} alt="Zozo Land" />
        </button>

      </div>
    </header>
  );
}
