import React, { useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import SiteHeader from "../../../components/SiteHeader/SiteHeader";
import "./Login.css";

export default function Login() {
  const navigate = useNavigate();

  const API_BASE = useMemo(
    () =>
      import.meta?.env?.VITE_API_URL ||
      process.env.REACT_APP_API_URL ||
      "",
    []
  );

  const [form, setForm] = useState({
    email: "",
    password: "",
    remember: true,
  });
  const [showPwd, setShowPwd] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [serverMsg, setServerMsg] = useState("");

  const onChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((s) => ({ ...s, [name]: type === "checkbox" ? checked : value }));
    setErrors((s) => ({ ...s, [name]: "" }));
  };

  const validate = () => {
    const e = {};
    if (!form.email.trim()) e.email = "Vui lòng nhập email.";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim()))
      e.email = "Email không hợp lệ.";
    if (!form.password) e.password = "Vui lòng nhập mật khẩu.";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const onSubmit = async (ev) => {
    ev.preventDefault();
    setServerMsg("");
    if (!validate()) return;

    try {
      setLoading(true);
      const res = await fetch(`${API_BASE}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: form.email.trim(),
          password: form.password,
        }),
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok || !data?.success) {
        throw new Error(data?.message || "Đăng nhập không thành công.");
      }

      // Lưu token & user
      if (data.token) {
        const storage = form.remember ? localStorage : sessionStorage;
        storage.setItem("authToken", data.token);
        storage.setItem("authUser", JSON.stringify(data.user || {}));
      }

      navigate("/"); // đổi route nếu cần
    } catch (err) {
      setServerMsg(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <SiteHeader />
      <main className="login-page" role="main">
        <div className="login-card" aria-live="polite">
          <h1 className="login-title">Đăng nhập</h1>

          {serverMsg && <div className="login-alert is-error">{serverMsg}</div>}

          <form className="login-form" onSubmit={onSubmit} noValidate>
            <label className="login-field">
              <span className="login-label">Email</span>
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={onChange}
                placeholder="Hãy nhập email của bạn"
                autoComplete="email"
                className={`login-input ${errors.email ? "has-error" : ""}`}
              />
              {errors.email && (
                <small className="login-error">{errors.email}</small>
              )}
            </label>

            <label className="login-field">
              <span className="login-label">Mật khẩu</span>
              <div className="login-input-wrap">
                <input
                  type={showPwd ? "text" : "password"}
                  name="password"
                  value={form.password}
                  onChange={onChange}
                  placeholder=""
                  autoComplete="current-password"
                  className={`login-input ${errors.password ? "has-error" : ""}`}
                />
                <button
                  type="button"
                  className="login-eye"
                  onClick={() => setShowPwd((s) => !s)}
                  aria-label={showPwd ? "Ẩn mật khẩu" : "Hiện mật khẩu"}
                >
                  {showPwd ? "Ẩn" : "Hiện"}
                </button>
              </div>
              {errors.password && (
                <small className="login-error">{errors.password}</small>
              )}
            </label>

            <div className="login-row">
              <label className="login-remember">
                <input
                  type="checkbox"
                  name="remember"
                  checked={form.remember}
                  onChange={onChange}
                />
                <span>Ghi nhớ tôi</span>
              </label>

              <Link to="/forgot-password" className="login-link dim">
                Quên mật khẩu
              </Link>
            </div>

            <button className="login-submit" disabled={loading}>
              {loading ? "Đang đăng nhập..." : "ĐĂNG NHẬP"}
            </button>
          </form>

          <p className="login-switch">
            Bạn chưa có tài khoản?{" "}
            <Link to="/register" className="login-link">
              Đăng ký
            </Link>
          </p>

          <p className="login-note">
            Đăng ký giúp bạn có thể coi lại vé của mình sau khi đặt.
          </p>
        </div>
      </main>
    </>
  );
}
