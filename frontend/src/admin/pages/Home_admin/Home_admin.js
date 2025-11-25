import React, { useEffect, useState } from "react";
import "./Home_admin.css";
export default function Dashboard() {
  const [stats, setStats] = useState(null);

  useEffect(() => {
    fetchDashboard();
  }, []);

  const fetchDashboard = async () => {
    const token = localStorage.getItem("authToken");

    const res = await fetch("http://localhost:4000/api/admin/stats", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const data = await res.json();
    setStats(data);
  };

  if (!stats) return <p>Loading...</p>;

  return (
    <div className="dashboard-container">
      <h1>Admin Dashboard</h1>

      <div className="grid">
        <div className="card">
          <h3>Doanh thu hôm nay</h3>
          <p> VND</p>
        </div>

        <div className="card">
          <h3>Đơn hàng hôm nay</h3>
          <p>{stats.dailyOrders}</p>
        </div>

        <div className="card">
          <h3>Doanh thu tháng này</h3>
          <p> VND</p>
        </div>

        <div className="card">
          <h3>Tổng đơn tháng này</h3>
          <p>{stats.monthlyOrders}</p>
        </div>
      </div>
    </div>
  );
}
