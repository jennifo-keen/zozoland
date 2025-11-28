import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import "./AdminDiscount.css";

export default function DiscountAdd() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    code: "",
    type: "fixed", 
    value: "",
    minOrderAmount: 0,
    startsAt: "",
    endsAt: "",
    usageLimit: 100,
    perUserLimit: 1,
    allowedCategories: [], 
    isActive: true
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === "checkbox" && name === "isActive" ? checked : value
    }));
  };

  const handleCategoryChange = (e) => {
    const { value, checked } = e.target;
    let updatedCats = [...formData.allowedCategories];
    if (checked) {
      updatedCats.push(value);
    } else {
      updatedCats = updatedCats.filter(cat => cat !== value);
    }
    setFormData({ ...formData, allowedCategories: updatedCats });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch("http://localhost:4000/api/admin/discount", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        alert("Thêm thành công!");
        navigate("/admin/discount");
      } else {
        alert("Lỗi thêm mã!");
      }
    } catch (error) {
      alert("Lỗi server!");
    }
  };

  return (
    <div className="admindiscount-container">
      <div className="admindiscount-form-card">
        <h2 className="admindiscount-title" style={{textAlign: "center"}}>Thêm Mã Mới</h2>
        
        <form onSubmit={handleSubmit}>
          
          <div style={{ display: "flex", gap: "20px" }}>
            <div className="form-group" style={{ flex: 1 }}>
              <label className="admindiscount-label">Mã Code (VD: ZOO10K)</label>
              <input type="text" name="code" className="admindiscount-input"
                value={formData.code} onChange={(e) => setFormData({...formData, code: e.target.value.toUpperCase()})} required />
            </div>
            <div className="form-group" style={{ flex: 1 }}>
              <label className="admindiscount-label">Loại giảm giá</label>
              <select name="type" className="admindiscount-input" value={formData.type} onChange={handleChange}>
                <option value="fixed">Trừ tiền trực tiếp (VNĐ)</option>
                <option value="percent">Giảm theo phần trăm (%)</option>
              </select>
            </div>
          </div>

          <div style={{ display: "flex", gap: "20px" }}>
            <div className="form-group" style={{ flex: 1 }}>
              <label className="admindiscount-label">Giá trị ({formData.type === 'fixed' ? 'VNĐ' : '%'})</label>
              <input type="number" name="value" className="admindiscount-input"
                value={formData.value} onChange={handleChange} required />
            </div>
            <div className="form-group" style={{ flex: 1 }}>
              <label className="admindiscount-label">Đơn tối thiểu (VNĐ)</label>
              <input type="number" name="minOrderAmount" className="admindiscount-input"
                value={formData.minOrderAmount} onChange={handleChange} />
            </div>
          </div>

          <div style={{ display: "flex", gap: "20px" }}>
            <div className="form-group" style={{ flex: 1 }}>
              <label className="admindiscount-label">Ngày bắt đầu</label>
              <input type="date" name="startsAt" className="admindiscount-input"
                value={formData.startsAt} onChange={handleChange} required />
            </div>
            <div className="form-group" style={{ flex: 1 }}>
              <label className="admindiscount-label">Ngày kết thúc</label>
              <input type="date" name="endsAt" className="admindiscount-input"
                value={formData.endsAt} onChange={handleChange} required />
            </div>
          </div>

          <div style={{ display: "flex", gap: "20px" }}>
            <div className="form-group" style={{ flex: 1 }}>
              <label className="admindiscount-label">Tổng lượt dùng</label>
              <input type="number" name="usageLimit" className="admindiscount-input"
                value={formData.usageLimit} onChange={handleChange} />
            </div>
            <div className="form-group" style={{ flex: 1 }}>
              <label className="admindiscount-label">Giới hạn mỗi khách</label>
              <input type="number" name="perUserLimit" className="admindiscount-input"
                value={formData.perUserLimit} onChange={handleChange} />
            </div>
          </div>

          <div className="form-group">
            <label className="admindiscount-label">Áp dụng cho vé:</label>
            <div style={{ display: "flex", gap: "15px", marginTop: "5px" }}>
              <label style={{display: "flex", alignItems: "center", gap: "5px"}}>
                <input type="checkbox" value="adult" 
                  checked={formData.allowedCategories.includes("adult")} onChange={handleCategoryChange} /> Người lớn
              </label>
              <label style={{display: "flex", alignItems: "center", gap: "5px"}}>
                <input type="checkbox" value="child" 
                  checked={formData.allowedCategories.includes("child")} onChange={handleCategoryChange} /> Trẻ em
              </label>
              <label style={{display: "flex", alignItems: "center", gap: "5px"}}>
                <input type="checkbox" value="student" 
                  checked={formData.allowedCategories.includes("student")} onChange={handleCategoryChange} /> Học sinh
              </label>
            </div>
          </div>

          <div className="form-group" style={{marginTop: "15px"}}>
             <label style={{display: "flex", alignItems: "center", gap: "10px", fontWeight: "bold"}}>
                <input type="checkbox" name="isActive" checked={formData.isActive} onChange={handleChange} style={{transform: "scale(1.5)"}} />
                Đang kích hoạt
             </label>
          </div>

          <button type="submit" className="admindiscount-btn-save">Lưu Mã</button>
          <Link to="/admin/discount" className="admindiscount-btn-cancel">Hủy</Link>
        </form>
      </div>
    </div>
  );
}