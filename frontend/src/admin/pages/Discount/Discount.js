import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "./AdminDiscount.css";

export default function DiscountList() {
  const [discounts, setDiscounts] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchDiscounts = async () => {
    try {
      const res = await fetch("http://localhost:4000/api/admin/discount");
      const data = await res.json();
      setDiscounts(data);
    } catch (error) {
      console.error("Lỗi:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDiscounts();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("Xóa mã này?")) return;
    try {
      const res = await fetch(`http://localhost:4000/api/admin/discount/${id}`, { method: "DELETE" });
      if (res.ok) {
        setDiscounts(discounts.filter((d) => d._id !== id));
      }
    } catch (error) {
      alert("Lỗi server");
    }
  };

  const formatDate = (d) => d ? new Date(d).toLocaleDateString("vi-VN") : "";

  // Hàm format giá trị (VD: 10.000đ hoặc 20%)
  const formatValue = (item) => {
    if (item.type === "fixed") return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(item.value);
    return `${item.value}%`;
  };

  if (loading) return <div className="admindiscount-container">Đang tải...</div>;

  return (
    <div className="admindiscount-container">
      <div className="admindiscount-header">
        <h1 className="admindiscount-title">Quản lý Mã Giảm Giá</h1>
        <Link to="/admin/discount/add" className="admindiscount-btn-add">+ Thêm Mã Mới</Link>
      </div>

      <div className="admindiscount-table-wrapper">
        <table className="admindiscount-table">
          <thead>
            <tr>
              <th className="admindiscount-th">Mã Code</th>
              <th className="admindiscount-th">Loại</th>
              <th className="admindiscount-th">Giá trị</th>
              <th className="admindiscount-th">Thời hạn</th>
              <th className="admindiscount-th">Lượt dùng</th>
              <th className="admindiscount-th">Trạng thái</th>
              <th className="admindiscount-th">Hành động</th>
            </tr>
          </thead>
          <tbody>
            {discounts.map((item) => (
              <tr key={item._id}>
                <td className="admindiscount-td">
                  <span className="admindiscount-code">{item.code}</span>
                </td>
                <td className="admindiscount-td">
                  {item.type === "fixed" ? "Giảm tiền" : "Phần trăm"}
                </td>
                <td className="admindiscount-td" style={{fontWeight: "bold", color: "#059669"}}>
                  {formatValue(item)}
                </td>
                <td className="admindiscount-td">
                  {formatDate(item.startsAt)} - {formatDate(item.endsAt)}
                </td>
                <td className="admindiscount-td">
                  {item.usedCount} / {item.usageLimit}
                </td>
                <td className="admindiscount-td">
                  {item.isActive ? (
                    <span style={{color: "green", fontWeight: "bold"}}>Active</span>
                  ) : (
                    <span style={{color: "red", fontWeight: "bold"}}>Inactive</span>
                  )}
                </td>
                <td className="admindiscount-td">
                  <button onClick={() => handleDelete(item._id)} className="admindiscount-btn-delete">Xóa</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}