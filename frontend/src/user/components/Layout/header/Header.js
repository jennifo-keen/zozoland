import React, { useEffect, useMemo, useRef, useState, useCallback } from "react";
import "./Header.css";

function readAuth() {
  const rawUser =
    localStorage.getItem("authUser") || sessionStorage.getItem("authUser");
  const token =
    localStorage.getItem("authToken") || sessionStorage.getItem("authToken");
  let user = null;
  try { user = rawUser ? JSON.parse(rawUser) : null; } catch {}
  return token && user ? user : null;
}

export default function Header() {
  const [user, setUser] = useState(() => readAuth());
  const [open, setOpen] = useState(false);
  const menuRef = useRef(null);
  const btnRef = useRef(null);

  const displayName = useMemo(() => {
    if (!user) return "";
    return user.fullName || user.username || (user.email || "").split("@")[0];
  }, [user]);

  const syncAuth = useCallback(() => setUser(readAuth()), []);
  useEffect(() => {
    const onStorage = () => syncAuth();
    window.addEventListener("storage", onStorage);
    window.addEventListener("auth-changed", onStorage);
    return () => {
      window.removeEventListener("storage", onStorage);
      window.removeEventListener("auth-changed", onStorage);
    };
  }, [syncAuth]);

  const logout = () => {
    localStorage.removeItem("authToken");
    localStorage.removeItem("authUser");
    sessionStorage.removeItem("authToken");
    sessionStorage.removeItem("authUser");
    setUser(null);
    setOpen(false);
    window.dispatchEvent(new Event("auth-changed"));
  };

  // Đóng khi click ra ngoài
  useEffect(() => {
    if (!open) return;
    const onClickOutside = (e) => {
      if (
        menuRef.current &&
        !menuRef.current.contains(e.target) &&
        btnRef.current &&
        !btnRef.current.contains(e.target)
      ) {
        setOpen(false);
      }
    };
    const onEsc = (e) => { if (e.key === "Escape") setOpen(false); };
    document.addEventListener("mousedown", onClickOutside);
    document.addEventListener("keydown", onEsc);
    return () => {
      document.removeEventListener("mousedown", onClickOutside);
      document.removeEventListener("keydown", onEsc);
    };
  }, [open]);

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
            <a href="/zooareas">Tham quan</a>
            <a href="#what">Tin tức</a>
            <a href="#support">Liên hệ chúng tôi</a>
          </div>

          <div className="nav__actions">
            {!user ? (
              <>
                <a className="btn btn-text" href="/login">Đăng nhập</a>
                <a className="btn btn-primary" href="#book">Đặt vé</a>
              </>
            ) : (
              <div className="user-menu">
              <a href={`/dashboard/${user.id}`} className="btn btn-text user-menu__btn">
                {displayName}
              </a>


              </div>
            )}
          </div>
        </nav>
      </div>
    </header>
  );
}
