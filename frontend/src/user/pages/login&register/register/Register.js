import React, { useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import SiteHeader from "../../../components/SiteHeader/SiteHeader";
import "./Register.css";

export default function Register() {
  const navigate = useNavigate();

  // API base giống các trang khác
  const API_BASE = useMemo(
    () =>
      import.meta?.env?.VITE_API_URL ||
      process.env.REACT_APP_API_URL ||
      "",
    []
  );

  const [form, setForm] = useState({
    fullName: "",
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [showPwd, setShowPwd] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [serverMsg, setServerMsg] = useState("");

  const onChange = (e) => {
    setForm((s) => ({ ...s, [e.target.name]: e.target.value }));
    setErrors((s) => ({ ...s, [e.target.name]: "" }));
  };

  const validate = () => {
    const e = {};
    if (!form.fullName.trim()) e.fullName = "Vui lòng nhập tên của bạn.";

    if (!form.username.trim()) e.username = "Vui lòng nhập tên đăng nhập.";
    else if (form.username.length < 4)
      e.username = "Tên đăng nhập phải từ 4 ký tự.";

    if (!form.email.trim()) e.email = "Vui lòng nhập email.";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim()))
      e.email = "Email không hợp lệ.";

    if (!form.password) e.password = "Vui lòng nhập mật khẩu.";
    else if (form.password.length < 6)
      e.password = "Mật khẩu phải từ 6 ký tự.";

    if (form.confirmPassword !== form.password)
      e.confirmPassword = "Mật khẩu nhập lại không khớp.";

    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setServerMsg("");
    if (!validate()) return;

    try {
      setLoading(true);
      const res = await fetch(`${API_BASE}/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fullName: form.fullName.trim(),
          username: form.username.trim(),
          email: form.email.trim(),
          password: form.password,
        }),
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        throw new Error(
          data?.message ||
            (res.status === 409
              ? "Username hoặc email đã tồn tại."
              : "Đăng ký không thành công.")
        );
      }

      setServerMsg("Đăng ký thành công! Bạn có thể đăng nhập.");
      setTimeout(() => navigate("/login"), 900);
    } catch (err) {
      setServerMsg(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <SiteHeader />
      <main className="reg-page" role="main">
        <div className="reg-card" aria-live="polite">
          <h1 className="reg-title">Đăng ký</h1>

          {serverMsg && (
            <div
              className={`reg-alert ${
                serverMsg.includes("thành công") ? "is-success" : "is-error"
              }`}
            >
              {serverMsg}
            </div>
          )}

          <form className="reg-form" onSubmit={onSubmit} noValidate>
            <label className="reg-field">
              <span className="reg-label">Tên của bạn</span>
              <input
                type="text"
                name="fullName"
                value={form.fullName}
                onChange={onChange}
                placeholder="Nguyễn Văn A"
                autoComplete="name"
                className={`reg-input ${errors.fullName ? "has-error" : ""}`}
              />
              {errors.fullName && (
                <small className="reg-error">{errors.fullName}</small>
              )}
            </label>

            <label className="reg-field">
              <span className="reg-label">Tên đăng nhập</span>
              <input
                type="text"
                name="username"
                value={form.username}
                onChange={onChange}
                placeholder="zoo_fan"
                autoComplete="username"
                className={`reg-input ${errors.username ? "has-error" : ""}`}
              />
              {errors.username && (
                <small className="reg-error">{errors.username}</small>
              )}
            </label>

            <label className="reg-field">
              <span className="reg-label">Email</span>
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={onChange}
                placeholder="ban@vidu.com"
                autoComplete="email"
                className={`reg-input ${errors.email ? "has-error" : ""}`}
              />
              {errors.email && (
                <small className="reg-error">{errors.email}</small>
              )}
            </label>

            <label className="reg-field">
              <span className="reg-label">Mật khẩu</span>
              <div className="reg-input-wrap">
                <input
                  type={showPwd ? "text" : "password"}
                  name="password"
                  value={form.password}
                  onChange={onChange}
                  placeholder="••••••••"
                  autoComplete="new-password"
                  className={`reg-input ${errors.password ? "has-error" : ""}`}
                />
                <button
                  type="button"
                  className="reg-eye"
                  onClick={() => setShowPwd((s) => !s)}
                  aria-label={showPwd ? "Ẩn mật khẩu" : "Hiện mật khẩu"}
                >
                  {showPwd ? "Ẩn" : "Hiện"}
                </button>
              </div>
              {errors.password && (
                <small className="reg-error">{errors.password}</small>
              )}
            </label>

            <label className="reg-field">
              <span className="reg-label">Nhập lại mật khẩu</span>
              <input
                type={showPwd ? "text" : "password"}
                name="confirmPassword"
                value={form.confirmPassword}
                onChange={onChange}
                placeholder="••••••••"
                autoComplete="new-password"
                className={`reg-input ${
                  errors.confirmPassword ? "has-error" : ""
                }`}
              />
              {errors.confirmPassword && (
                <small className="reg-error">{errors.confirmPassword}</small>
              )}
            </label>

            <button className="reg-submit" disabled={loading}>
              {loading ? "Đang đăng ký..." : "ĐĂNG KÝ"}
            </button>
          </form>

          <p className="reg-switch">
            Bạn đã có tài khoản?{" "}
            <Link to="/login" className="reg-link">
              Đăng nhập
            </Link>
          </p>
        </div>
      </main>
    </>
  );
}
