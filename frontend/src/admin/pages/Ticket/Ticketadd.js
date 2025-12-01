import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import "./AdminTicket.css";

export default function TicketAdd() {
  const navigate = useNavigate();

  const [date, setDate] = useState("");
  const [totalCapacity, setTotalCapacity] = useState(5000);
  const [capacities, setCapacities] = useState({
    adult: 3000,
    child: 1500,
    student: 1500
  });

  const handleCapacityChange = (e) => {
    setCapacities({ ...capacities, [e.target.name]: parseInt(e.target.value) || 0 });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Tính tổng lại để đảm bảo logic (Optional)
    const calculatedTotal = capacities.adult + capacities.child + capacities.student;
    // Nếu bạn muốn user tự nhập tổng thì bỏ dòng setTotal dưới, nhưng thường tổng = cộng các thành phần
    
    const payload = {
      date: date, // YYYY-MM-DD
      totalCapacity: totalCapacity, 
      perCategoryCapacity: capacities
    };

    try {
      const res = await fetch("http://localhost:4000/api/admin/ticket", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (res.ok) {
        alert("Tạo lịch vé thành công!");
        navigate("/admin/ticket");
      } else {
        // XỬ LÝ LỖI TRÙNG NGÀY Ở ĐÂY
        if (data.message === "DUPLICATE_DATE") {
           alert("LỖI: Ngày này đã được tạo cấu hình vé rồi!\nVui lòng chọn ngày khác hoặc sửa cấu hình cũ.");
        } else {
           alert("Lỗi: " + data.message);
        }
      }
    } catch (error) {
      alert("Lỗi Server!");
    }
  };

  return (
    <div className="adminticket-container">
      <div className="adminticket-form-card">
        <h2 className="adminticket-title" style={{textAlign: "center", marginBottom: "20px"}}>
          Cấu Hình Vé Ngày Mới
        </h2>
        
        <form onSubmit={handleSubmit}>
          
          <div className="adminticket-form-group">
            <label className="adminticket-label">Chọn Ngày</label>
            <input 
              type="date" 
              className="adminticket-input" 
              value={date} 
              onChange={(e) => setDate(e.target.value)} 
              required 
            />
          </div>

          <div className="adminticket-form-group">
            <label className="adminticket-label">Tổng sức chứa (Vé)</label>
            <input 
              type="number" 
              className="adminticket-input" 
              value={totalCapacity} 
              onChange={(e) => setTotalCapacity(e.target.value)} 
              required 
            />
          </div>

          <div style={{display: 'flex', gap: '15px'}}>
            <div className="adminticket-form-group" style={{flex: 1}}>
              <label className="adminticket-label">Vé Người lớn</label>
              <input type="number" name="adult" className="adminticket-input" value={capacities.adult} onChange={handleCapacityChange} />
            </div>
            <div className="adminticket-form-group" style={{flex: 1}}>
              <label className="adminticket-label">Vé Trẻ em</label>
              <input type="number" name="child" className="adminticket-input" value={capacities.child} onChange={handleCapacityChange} />
            </div>
            <div className="adminticket-form-group" style={{flex: 1}}>
              <label className="adminticket-label">Vé HSSV</label>
              <input type="number" name="student" className="adminticket-input" value={capacities.student} onChange={handleCapacityChange} />
            </div>
          </div>

          <button type="submit" className="adminticket-btn-save">Lưu Cấu Hình</button>
          <Link to="/admin/ticket" className="adminticket-btn-cancel">Hủy</Link>
        </form>
      </div>
    </div>
  );
}