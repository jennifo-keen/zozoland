import { useState } from "react";
import { useNavigate } from "react-router-dom"; // Thêm cái này để chuyển trang mượt hơn
import "./Login.css";
import { useAuth } from "../../context/authContext";

export default function AdminLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  
  const { login } = useAuth();
  const navigate = useNavigate(); // Hook chuyển trang

  const handleLogin = async (e) => {
    e.preventDefault();
    setError(""); // Reset lỗi cũ trước khi gọi API mới

    try {
      // Gọi hàm login từ Context
      // Nếu sai pass hoặc lỗi mạng, nó sẽ nhảy xuống phần catch ngay lập tức
      await login(email, password);
      
      // Nếu code chạy đến dòng này nghĩa là Đăng nhập thành công
      // Chuyển hướng về trang admin
      navigate("/admin"); 
    } catch (err) {
      // Bắt lỗi từ Context ném ra (ví dụ: "Sai mật khẩu")
      setError(err.message || "Đăng nhập thất bại");
    }
  };

  return (
    <div className="admin-login-container">
      <form onSubmit={handleLogin} className="admin-login-box">
        <h2>Admin Login</h2>

        {error && <p className="error">{error}</p>}

        <input
          type="text" // Đổi thành text nếu bạn đăng nhập bằng username, để email nếu bắt buộc là email
          placeholder="Tên đăng nhập hoặc Email"
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