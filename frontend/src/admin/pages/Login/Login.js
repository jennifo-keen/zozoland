import { useState } from "react";
import "./Login.css";
import { useAuth } from "../../context/authContext";

export default function AdminLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const { login } = useAuth();

  const handleLogin = async (e) => {
    e.preventDefault();

    const result = await login(email, password);
    if (!result.success) {
      setError(result.error || "Đăng nhập thất bại");
      return;
    }
    window.location.href = "/admin";
  };

  return (
    <div className="admin-login-container">
      <form onSubmit={handleLogin} className="admin-login-box">
        <h2>Admin Login</h2>

        {error && <p className="error">{error}</p>}

        <input
          type="email"
          placeholder="Email admin"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <input
          type="password"
          placeholder="Mật khẩu"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <button type="submit">Đăng nhập</button>
      </form>
    </div>
  );
}
