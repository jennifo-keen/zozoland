import { useState, useEffect } from "react";
import { useSearchParams, useNavigate, Link } from "react-router-dom";
import "./AdminTicket.css";

export default function TicketMod() {
  const [searchParams] = useSearchParams();
  const id = searchParams.get("id");
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    date: "",
    totalCapacity: 0,
    adult: 0,
    child: 0,
    student: 0
  });

  useEffect(() => {
    if (!id) return;
    const fetchTicket = async () => {
      try {
        const res = await fetch(`http://localhost:4000/api/admin/ticket/${id}`);
        const data = await res.json();
        
        const formatDate = (d) => d ? new Date(d).toISOString().split("T")[0] : "";

        setFormData({
          date: formatDate(data.date),
          totalCapacity: data.totalCapacity,
          adult: data.perCategoryCapacity.adult,
          child: data.perCategoryCapacity.child,
          student: data.perCategoryCapacity.student
        });
      } catch (error) {
        console.error(error);
      }
    };
    fetchTicket();
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Gom lại đúng cấu trúc Nested Object của Schema
    const payload = {
      date: formData.date,
      totalCapacity: formData.totalCapacity,
      perCategoryCapacity: {
        adult: formData.adult,
        child: formData.child,
        student: formData.student
      }
    };

    try {
      const res = await fetch(`http://localhost:4000/api/admin/ticket/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        alert("Cập nhật thành công!");
        navigate("/admin/ticket");
      }
    } catch (error) {
      alert("Lỗi server");
    }
  };

  return (
    <div className="adminticket-container">
      <div className="adminticket-form-card">
        <h2 className="adminticket-title" style={{textAlign: "center", marginBottom: "20px"}}>
          Sửa Cấu Hình Vé
        </h2>
        
        <form onSubmit={handleSubmit}>
          
          <div className="adminticket-form-group">
            <label className="adminticket-label">Ngày (Không nên sửa)</label>
            <input 
              type="date" 
              className="adminticket-input" 
              style={{backgroundColor: '#e5e7eb'}}
              value={formData.date} 
              readOnly 
            />
          </div>

          <div className="adminticket-form-group">
            <label className="adminticket-label">Tổng sức chứa</label>
            <input 
              type="number" 
              className="adminticket-input" 
              value={formData.totalCapacity} 
              onChange={(e) => setFormData({...formData, totalCapacity: e.target.value})} 
            />
          </div>

          <div style={{display: 'flex', gap: '15px'}}>
            <div className="adminticket-form-group" style={{flex: 1}}>
              <label className="adminticket-label">Người lớn</label>
              <input type="number" className="adminticket-input" 
                value={formData.adult} onChange={(e) => setFormData({...formData, adult: e.target.value})} />
            </div>
            <div className="adminticket-form-group" style={{flex: 1}}>
              <label className="adminticket-label">Trẻ em</label>
              <input type="number" className="adminticket-input" 
                value={formData.child} onChange={(e) => setFormData({...formData, child: e.target.value})} />
            </div>
            <div className="adminticket-form-group" style={{flex: 1}}>
              <label className="adminticket-label">HSSV</label>
              <input type="number" className="adminticket-input" 
                value={formData.student} onChange={(e) => setFormData({...formData, student: e.target.value})} />
            </div>
          </div>

          <button type="submit" className="adminticket-btn-save">Lưu Thay Đổi</button>
          <Link to="/admin/ticket" className="adminticket-btn-cancel">Hủy</Link>
        </form>
      </div>
    </div>
  );
}