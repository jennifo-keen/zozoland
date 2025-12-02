import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "./AdminTicket.css";

export default function TicketList() {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const [searchDate, setSearchDate] = useState("");

  const fetchTickets = async () => {
    try {
      const res = await fetch("http://localhost:4000/api/admin/ticket");
      const data = await res.json();
      setTickets(data);
    } catch (error) {
      console.error("Lỗi:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTickets();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("Bạn chắc chắn muốn xóa ngày vé này?")) return;
    try {
      const res = await fetch(`http://localhost:4000/api/admin/ticket/${id}`, {
        method: "DELETE",
      });
      if (res.ok) {
        setTickets(tickets.filter((t) => t._id !== id));
      }
    } catch (error) {
      alert("Lỗi khi xóa!");
    }
  };

  const formatDate = (d) => {
    if (!d) return "";
    const date = new Date(d);
    return `Ngày ${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`;
  };

  const filteredTickets = tickets.filter((item) => {
    if (!searchDate) return true; 

    const itemDate = new Date(item.date).toISOString().split("T")[0];
    return itemDate === searchDate;
  });

  if (loading) return <div className="adminticket-container">Đang tải...</div>;

  return (
    <div className="adminticket-container">
      <div className="adminticket-header">
        <h1 className="adminticket-title">Quản lý Kho Vé Hàng Ngày</h1>
        
        <div className="adminticket-actions">
          <input 
            type="date" 
            className="adminticket-search-input"
            value={searchDate}
            onChange={(e) => setSearchDate(e.target.value)}
            title="Lọc theo ngày"
          />
          
          {searchDate && (
            <button 
              className="adminticket-btn-clear" 
              onClick={() => setSearchDate("")}
            >
              Hiện tất cả
            </button>
          )}

          <Link to="/admin/ticket/add" className="adminticket-btn-add">+ Tạo Lịch Vé Mới</Link>
        </div>
      </div>

      <div className="adminticket-table-wrapper">
        <table className="adminticket-table">
          <thead>
            <tr>
              <th className="adminticket-th">Ngày áp dụng</th>
              <th className="adminticket-th">Tổng Sức Chứa</th>
              <th className="adminticket-th">Chi tiết (Người lớn/Trẻ em/HSSV)</th>
              <th className="adminticket-th">Đã Bán</th>
              <th className="adminticket-th">Hành động</th>
            </tr>
          </thead>
          <tbody>
            {filteredTickets.length > 0 ? (
              filteredTickets.map((item) => (
                <tr key={item._id}>
                  <td className="adminticket-td">
                    <span className="adminticket-date-highlight">{formatDate(item.date)}</span>
                  </td>
                  <td className="adminticket-td">
                    <b>{item.totalCapacity}</b> vé
                  </td>
                  <td className="adminticket-td">
                    <span className="adminticket-subtext">Adult: {item.perCategoryCapacity.adult}</span>
                    <span className="adminticket-subtext">Child: {item.perCategoryCapacity.child}</span>
                    <span className="adminticket-subtext">Student: {item.perCategoryCapacity.student}</span>
                  </td>
                  <td className="adminticket-td" style={{color: item.soldCounts.total >= item.totalCapacity ? 'red' : 'green'}}>
                    {item.soldCounts.total} / {item.totalCapacity}
                  </td>
                  <td className="adminticket-td">
                    <Link to={`/admin/ticket/mod?id=${item._id}`} style={{marginRight: '10px', color: 'blue', fontWeight: 'bold', textDecoration: 'none'}}>Sửa</Link>
                    <button onClick={() => handleDelete(item._id)} style={{color: 'red', fontWeight: 'bold', border: 'none', background: 'none', cursor: 'pointer'}}>Xóa</button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" style={{padding: "20px", textAlign: "center", fontStyle: "italic"}}>
                  Không tìm thấy dữ liệu cho ngày này.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}