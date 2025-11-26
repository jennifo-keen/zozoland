import React, { useEffect, useState } from "react";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from "recharts";

const Report = () => {
  const [dailyData, setDailyData] = useState([]);
  const [monthlyData, setMonthlyData] = useState([]);
  const [loading, setLoading] = useState(true);

  const formatVND = (value) =>
    new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(value);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [resDaily, resMonthly] = await Promise.all([
          fetch("http://localhost:4000/api/admin/order/daily-revenue"),
          fetch("http://localhost:4000/api/admin/order/monthly-revenue")
        ]);

        if (!resDaily.ok || !resMonthly.ok) throw new Error("Lỗi kết nối API");

        const daily = await resDaily.json();
        const monthly = await resMonthly.json();

        setDailyData(daily);
        setMonthlyData(monthly);
      } catch (error) {
        console.error("Fetch error:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) return <div className="p-5 text-center">Đang tải dữ liệu báo cáo...</div>;

  return (
    <div style={{ padding: "30px", maxWidth: "1200px", margin: "0 auto" }}>
      <h1 style={{ textAlign: "center", marginBottom: "40px", color: "#333" }}>
        Báo Cáo Doanh Thu (Đơn đã thanh toán)
      </h1>
      <div style={styles.chartContainer}>
        <h3 style={styles.chartTitle}>Doanh Thu Theo Ngày</h3>
        <div style={{ width: "100%", height: 350 }}>
          <ResponsiveContainer>
            <BarChart data={dailyData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip formatter={(value) => formatVND(value)} />
              <Legend />
              <Bar dataKey="revenue" name="Doanh Thu (VND)" fill="#4F46E5" radius={[4, 4, 0, 0]} barSize={50} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div style={styles.chartContainer}>
        <h3 style={styles.chartTitle}>Doanh Thu Theo Tháng</h3>
        <div style={{ width: "100%", height: 350 }}>
          <ResponsiveContainer>
            <BarChart data={monthlyData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip formatter={(value) => formatVND(value)} />
              <Legend />
              <Bar dataKey="revenue" name="Doanh Thu (VND)" fill="#10B981" radius={[4, 4, 0, 0]} barSize={60} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

const styles = {
  chartContainer: {
    backgroundColor: "#fff",
    borderRadius: "12px",
    padding: "20px",
    boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
    marginBottom: "40px",
    border: "1px solid #e5e7eb"
  },
  chartTitle: {
    marginBottom: "20px",
    color: "#4b5563",
    borderBottom: "2px solid #f3f4f6",
    paddingBottom: "10px"
  }
};

export default Report;