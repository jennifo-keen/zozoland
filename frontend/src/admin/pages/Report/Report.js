import React, { useEffect, useState } from "react";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from "recharts";

const Report = () => {
  const [fullDailyData, setFullDailyData] = useState([]);
  const [fullMonthlyData, setFullMonthlyData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedMonth, setSelectedMonth] = useState(new Date().toISOString().slice(0, 7)); 
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear().toString());    

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

        setFullDailyData(daily);
        setFullMonthlyData(monthly);
      } catch (error) {
        console.error("Fetch error:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);
  const filteredDailyData = fullDailyData.filter(item => item.date.startsWith(selectedMonth));
  const filteredMonthlyData = fullMonthlyData.filter(item => item.month.startsWith(selectedYear));
  const uniqueMonths = [...new Set(fullDailyData.map(item => item.date.slice(0, 7)))].sort().reverse();
  const uniqueYears = [...new Set(fullMonthlyData.map(item => item.month.slice(0, 4)))].sort().reverse();

  if (loading) return <div className="p-5 text-center">Đang tải dữ liệu báo cáo...</div>;

  return (
    <div style={{ padding: "30px", maxWidth: "1200px", margin: "0 auto", fontFamily: "Arial, sans-serif" }}>
      <h1 style={{ textAlign: "center", marginBottom: "40px", color: "#ffffff" }}>
        Báo Cáo Doanh Thu
      </h1>
      <div style={styles.chartContainer}>
        <div style={styles.headerRow}>
          <h3 style={styles.chartTitle}>Doanh Thu Chi Tiết Theo Ngày</h3>
          <div style={styles.filterGroup}>
            <label>Chọn tháng: </label>
            <select 
              style={styles.select} 
              value={selectedMonth} 
              onChange={(e) => setSelectedMonth(e.target.value)}
            >
              {!uniqueMonths.includes(selectedMonth) && <option value={selectedMonth}>{selectedMonth}</option>}
              
              {uniqueMonths.map(month => (
                <option key={month} value={month}>{month}</option>
              ))}
            </select>
          </div>
        </div>

        <div style={{ width: "100%", height: 350 }}>
          <ResponsiveContainer>
            <BarChart data={filteredDailyData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip formatter={(value) => formatVND(value)} />
              <Legend />
              <Bar dataKey="revenue" name="Doanh Thu (VND)" fill="#4F46E5" radius={[4, 4, 0, 0]} barSize={50} />
            </BarChart>
          </ResponsiveContainer>
          {filteredDailyData.length === 0 && (
            <p style={{ textAlign: "center", color: "#999", marginTop: "-100px" }}>Không có dữ liệu cho tháng này</p>
          )}
        </div>
      </div>
      <div style={styles.chartContainer}>
        <div style={styles.headerRow}>
          <h3 style={styles.chartTitle}>Tổng Quan Doanh Thu Theo Năm</h3>
          <div style={styles.filterGroup}>
            <label>Chọn năm: </label>
            <select 
              style={styles.select} 
              value={selectedYear} 
              onChange={(e) => setSelectedYear(e.target.value)}
            >
               {!uniqueYears.includes(selectedYear) && <option value={selectedYear}>{selectedYear}</option>}

              {uniqueYears.map(year => (
                <option key={year} value={year}>{year}</option>
              ))}
            </select>
          </div>
        </div>

        <div style={{ width: "100%", height: 350 }}>
          <ResponsiveContainer>
            <BarChart data={filteredMonthlyData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip formatter={(value) => formatVND(value)} />
              <Legend />
              <Bar dataKey="revenue" name="Doanh Thu (VND)" fill="#10B981" radius={[4, 4, 0, 0]} barSize={60} />
            </BarChart>
          </ResponsiveContainer>
           {filteredMonthlyData.length === 0 && (
            <p style={{ textAlign: "center", color: "#999", marginTop: "-100px" }}>Không có dữ liệu cho năm này</p>
          )}
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
  headerRow: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "20px",
    borderBottom: "2px solid #f3f4f6",
    paddingBottom: "10px"
  },
  chartTitle: {
    margin: 0,
    color: "#000",
  },
  filterGroup: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
    fontSize: "14px",
    fontWeight: "bold",
    color: "#000"
  },
  select: {
    padding: "6px 12px",
    borderRadius: "6px",
    border: "1px solid #d1d5db",
    fontSize: "14px",
    outline: "none",
    cursor: "pointer",
    backgroundColor: "#f9fafb"
  }
};

export default Report;