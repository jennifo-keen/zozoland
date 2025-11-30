import { createContext, useContext, useEffect, useState } from "react";

const UserAuthContext = createContext();

export function UserAuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  // ✅ Lấy lại thông tin từ localStorage khi F5
  useEffect(() => {
    const storedToken = localStorage.getItem("userToken");
    const storedUser = localStorage.getItem("authUser");

    if (storedToken && storedUser) {
      setUser(JSON.parse(storedUser));
      setToken(storedToken);
    }
    setLoading(false);
  }, []);

  const login = (userData, tokenData) => {
    localStorage.setItem("authUser", JSON.stringify(userData));
    localStorage.setItem("userToken", tokenData);
    setUser(userData);
    setToken(tokenData);
  };

  const logout = () => {
    localStorage.removeItem("authUser");
    localStorage.removeItem("userToken");
    setUser(null);
    setToken(null);
  };


  return (
    <UserAuthContext.Provider value={{ user, token, login, logout, loading }}>
      {children}
    </UserAuthContext.Provider>
  );
}

export function useUserAuth() {
  return useContext(UserAuthContext);
}
