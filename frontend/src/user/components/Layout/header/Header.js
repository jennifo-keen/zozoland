import React, {
  useEffect,
  useMemo,
  useRef,
  useState,
  useCallback,
} from "react";
import { Link } from "react-router-dom";    // 🔥 THÊM
import "./Header.css";

// 🔥 Chỉ đọc từ localStorage (không dùng sessionStorage nữa)
function readAuth() {
  const rawUser = localStorage.getItem("authUser");
  const token = localStorage.getItem("authToken");

  if (!rawUser || !token) return null;

  try {
    return JSON.parse(rawUser);
  } catch {
    return null;
  }
}

export default function Header() {
  const [user, setUser] = useState(() => readAuth());
  const [open, setOpen] = useState(false);
  const menuRef = useRef(null);
  const btnRef = useRef(null);

  // Tính tên hiển thị
  const displayName = useMemo(() => {
    if (!user) return "";
    return (
      user.fullName ||
      user.username ||
      (user.email || "").split("@")[0]
    );
  }, [user]);

  // 🔥 Sync auth khi localStorage thay đổi
  const syncAuth = useCallback(() => {
    setUser(readAuth());
  }, []);

  useEffect(() => {
    window.addEventListener("storage", syncAuth);
    window.addEventListener("auth-changed", syncAuth);
    return () => {
      window.removeEventListener("storage", syncAuth);
      window.removeEventListener("auth-changed", syncAuth);
    };
  }, [syncAuth]);

  // 🔥 Logout CHỈ xóa localStorage
  const logout = () => {
    localStorage.removeItem("authToken");
    localStorage.removeItem("authUser");
    setUser(null);
    setOpen(false);
    window.dispatchEvent(new Event("auth-changed"));
  };

  // Đóng menu khi click ngoài
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
    const onEsc = (e) => {
      if (e.key === "Escape") setOpen(false);
    };

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
          <span className="dot"></span>
          <span>Giờ mở cửa: 10:00 – 16:30 (vào cổng cuối lúc 15:30)</span>
        </div>
      </div>

      <div className="navbar__wrapper">
        <nav className="navbar">

          {/* 🔥 Đổi <a> → <Link> */}
          <Link to="/" className="logo" aria-label="Zozoland">
            <img src="/logo.svg" alt="Zozoland logo" />
          </Link>

          <div className="nav__links_header">
            <Link to="/zooareas">Tham quan</Link>
            <a href="#what">Tin tức</a>
            <a href="#support">Liên hệ chúng tôi</a>
          </div>

          <div className="nav__actions">
            {!user ? (
              <>
                <Link className="btn btn-text" to="/login">
                  Đăng nhập
                </Link>

                <Link className="btn btn-primary" to="/bookingdate">
                  Đặt vé
                </Link>
              </>
            ) : (
              <div className="user-menu">
                <button
                  type="button"
                  ref={btnRef}
                  className="btn btn-text user-menu__btn"
                  aria-expanded={open}
                  onClick={() => setOpen((s) => !s)}
                >
                  {displayName}
                  <span className="caret">▾</span>
                </button>

                {open && (
                  <div className="user-menu__menu" ref={menuRef} role="menu">
                    <Link
                      to={`/dashboard/${user.id}`}
                      className="user-menu__item"
                      role="menuitem"
                    >
                      Thông tin
                    </Link>

                    <button
                      type="button"
                      className="user-menu__item is-danger"
                      onClick={logout}
                      role="menuitem"
                    >
                      Đăng xuất
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </nav>
      </div>
    </header>
  );
}
