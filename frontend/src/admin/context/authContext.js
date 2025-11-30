import React, { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // 1. Logic chạy khi F5 (Reload trang)
  useEffect(() => {
    const storedToken = localStorage.getItem("adminToken");
    const storedUser = localStorage.getItem("adminUser");

    if (storedToken && storedUser) {
      try {
        // Nếu tìm thấy token và user trong bộ nhớ, set lại State
        setIsLoggedIn(true);
        setUser(JSON.parse(storedUser));
      } catch (error) {
        // Phòng trường hợp dữ liệu trong localStorage bị lỗi
        console.error("Lỗi parse user data:", error);
        localStorage.removeItem("adminToken");
        localStorage.removeItem("adminUser");
      }
    }
    // Dù có đăng nhập hay không, cũng phải tắt loading để hiển thị trang
    setLoading(false);
  }, []);

  // 2. Logic Đăng nhập
  const login = async (username, password) => {
    try {
      const response = await fetch("http://localhost:4000/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Đăng nhập thất bại");

      // Lưu Token vào localStorage
      localStorage.setItem("adminToken", data.token);
      
      // QUAN TRỌNG: Lưu thông tin User vào localStorage để khi F5 lấy lại dùng
      localStorage.setItem("adminUser", JSON.stringify(data.user));

      setIsLoggedIn(true);
      setUser(data.user);
    } catch (error) {
      // Ném lỗi ra ngoài để component Login bắt được và hiển thị thông báo
      throw error;
    }
  };

  // 3. Logic Đăng xuất
  const logout = () => {
    localStorage.removeItem("adminToken");
    localStorage.removeItem("adminUser"); // Xóa sạch user khỏi bộ nhớ
    setIsLoggedIn(false);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ isLoggedIn, user, login, logout, loading }}>
      {!loading && children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth phải được sử dụng trong AuthProvider");
  }
  return context;
}