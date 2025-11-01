import React from "react";
import "./Header.css";

export default function Header() {
  return (
    <header className="header">

      <div className="topbar">
        <div className="container topbar__inner">
          <span>Vườn thú hiện đại nhất Việt Nam</span>
          <span className="dot" aria-hidden="true" />
          <span>Giờ mở cửa hôm nay: 10:00 – 16:30 (vào cổng cuối lúc 15:30)</span>
        </div>
      </div>

      <div className="navbar__wrapper">
        <nav className="navbar">
          <a href="/" className="logo" aria-label="Zozoland">
            <img src="logo.svg" alt="Zozoland logo" />
          </a>

          <div className="nav__links_header">
            <a href="#visit">Visit</a>
            <a href="#what">What’s here</a>
            <a href="#support">Support us</a>
          </div>

          <div className="nav__actions">
            <button className="btn btn-text">Đăng nhập</button>
            <a className="btn btn-primary" href="#book">Đặt vé</a>
          </div>
        </nav>
      </div>
    </header>
  );
}
