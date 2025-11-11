import { useState, useEffect } from "react";
import "./profile.css";

export default function Profile({ data, onUpdate }) {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    fullName: "",
    phone: "",
    address: "",
  });

  useEffect(() => {
    if (data) {
      setFormData({
        fullName: data.fullName || "",
        phone: data.phone || "",
        address: data.address || "",
      });
    }
  }, [data]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    try {
      const res = await fetch(`http://localhost:4000/api/userinfo/${data._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!res.ok) throw new Error("Cập nhật thất bại");

      const updated = await res.json();
      setIsEditing(false);
      if (onUpdate) onUpdate(updated); // cập nhật lại dữ liệu nếu cần
    } catch (err) {
      console.error("Lỗi cập nhật:", err);
      alert("Cập nhật thất bại. Vui lòng thử lại.");
    }
  };

  if (!data) return <p>Đang tải thông tin...</p>;

  return (
    <div className="profile-box">
      <h2>Thông Tin Cá Nhân</h2>
      <p className="subtitle">Quản lý thông tin tài khoản của bạn</p>

      {isEditing ? (
        <>
          <div className="user-info-row">
            <strong>Họ và Tên:</strong>
            <input name="fullName" value={formData.fullName} onChange={handleChange} />
          </div>
          <div className="user-info-row">
            <strong>Số Điện Thoại:</strong>
            <input name="phone" value={formData.phone} onChange={handleChange} />
          </div>
          <div className="user-info-row">
            <strong>Địa Chỉ:</strong>
            <input name="address" value={formData.address} onChange={handleChange} />
          </div>
          <button className="edit-button" onClick={handleSave}>Lưu</button>
        </>
      ) : (
        <>
          <div className="user-info-row"><strong>Họ và Tên:</strong> {data.fullName}</div>
          <div className="user-info-row"><strong>Email:</strong> {data.email}</div>
          <div className="user-info-row"><strong>Số Điện Thoại:</strong> {data.phone}</div>
          <div className="user-info-row"><strong>Địa Chỉ:</strong> {data.address || "Chưa cập nhật"}</div>
          <button className="edit-button" onClick={() => setIsEditing(true)}>Chỉnh Sửa</button>
        </>
      )}
    </div>
  );
}