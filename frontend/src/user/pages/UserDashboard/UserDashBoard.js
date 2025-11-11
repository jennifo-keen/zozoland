import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import Profile from "./Profile/Profile.js";
import TicketList from "./Ticketlist/TicketList.js";
import LogoutConfirm from "./LogoutConfirm.js";
import EditPassword from "./EditPassword.js";
import DeleteAccount from "./DeleteAccount.js";
import "./user.css";

export default function UserDashboard() {
  const { id: userId } = useParams();
  const [activeTab, setActiveTab] = useState("profile"); // "profile", "tickets", "logout"
  const [subTab, setSubTab] = useState("info"); // "info", "password", "delete"
  const [userData, setUserData] = useState(null);
  const [tickets, setTickets] = useState([]);

  const fetchUser = async () => {
    try {
      const res = await fetch(`http://localhost:4000/api/userinfo/${userId}`);
      const data = await res.json();
      setUserData(data);
    } catch (err) {
      console.error("Lỗi lấy thông tin người dùng:", err);
    }
  };

  const fetchTickets = async () => {
    try {
      const res = await fetch(`http://localhost:4000/api/userinfo/${userId}/orders`);
      const data = await res.json();
      setTickets(data);
    } catch (err) {
      console.error("Lỗi lấy vé:", err);
    }
  };

  // Gọi API khi tab thay đổi
  useEffect(() => {
    if (!userId) return;
    if (activeTab === "profile") fetchUser();
    if (activeTab === "tickets") fetchTickets();
  }, [activeTab, userId]);

  return (
    <div className="user-dashboard">
      {/* Thanh điều hướng chính */}
      <div className="dashboard-nav">
        <button className={activeTab === "profile" ? "active" : ""} onClick={() => setActiveTab("profile")}>
          Thông Tin Cá Nhân
        </button>
        <button className={activeTab === "tickets" ? "active" : ""} onClick={() => setActiveTab("tickets")}>
          Vé Của Tôi
        </button>
        <button className={activeTab === "logout" ? "active logout" : "logout"} onClick={() => setActiveTab("logout")}>
          Đăng Xuất
        </button>
      </div>

      {/* Menu phụ trong tab "Thông Tin Cá Nhân" */}
      {activeTab === "profile" && (
        <div className="dashboard-subnav">
          <button className={subTab === "info" ? "active" : ""} onClick={() => setSubTab("info")}>Thông Tin</button>
          <button onClick={() => setSubTab("password")}>Đổi Mật Khẩu</button>
          <button className="btn-danger" onClick={() => setSubTab("delete")}>Xóa Tài Khoản</button>
        </div>
      )}

      {/* Nội dung chính */}
      <div className="dashboard-content">
        {activeTab === "profile" && subTab === "info" && (
          <Profile data={userData} onUpdate={fetchUser} />
        )}
        {activeTab === "profile" && subTab === "password" && <EditPassword userId={userId} />}
        {activeTab === "profile" && subTab === "delete" && <DeleteAccount userId={userId} />}
        {activeTab === "tickets" && <TicketList tickets={tickets} userId={userId} />}
        {activeTab === "logout" && <LogoutConfirm />}
      </div>
    </div>
  );
}