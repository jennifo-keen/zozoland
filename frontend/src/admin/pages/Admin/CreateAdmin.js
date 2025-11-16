import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./CreateAdmin.css"
import Loading from "../../components/Loading/Loading";

export default function CreateAdmin() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "staff",
    note: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleChange = (field, value) => {
    setForm(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("http://localhost:4000/api/admin/admin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form)
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.message || "Thêm admin thất bại!");
      } else {
        alert("Thêm admin thành công!");
        navigate("/admin/admin");
      }
    } catch (err) {
      console.error(err);
      setError("Lỗi server!");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <Loading />
  }

  return (
    <div className="create-admin-container">
      <h1>Thêm quản trị viên mới</h1>
      {error && <p style={{color: 'red'}}>{error}</p>}
      <form onSubmit={handleSubmit}>
        <input 
          type="text" 
          placeholder="Tên admin" 
          value={form.name}
          onChange={(e) => handleChange("name", e.target.value)}
          required
        />
        <input 
          type="email" 
          placeholder="Email" 
          value={form.email}
          onChange={(e) => handleChange("email", e.target.value)}
          required
        />
        <input 
          type="password" 
          placeholder="Mật khẩu" 
          value={form.password}
          onChange={(e) => handleChange("password", e.target.value)}
          required
        />
        <select 
          value={form.role} 
          onChange={(e) => handleChange("role", e.target.value)}
        >
          <option value="staff">Staff</option>
          <option value="admin">Admin</option>
          <option value="superadmin">Superadmin</option>
        </select>
        <textarea 
          placeholder="Ghi chú" 
          value={form.note} 
          onChange={(e) => handleChange("note", e.target.value)}
        />
        <button type="submit">
          Thêm
        </button>
      </form>
    </div>
  );
}
