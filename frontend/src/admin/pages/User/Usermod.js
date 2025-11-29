import { useState, useEffect } from "react";
import { useSearchParams, useNavigate, Link } from "react-router-dom";
import "./AdminUser.css"; 

export default function UserMod() {
  const [searchParams] = useSearchParams();
  const userId = searchParams.get("id");
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    fullName: "",
    phone: "",
    dob: "", 
    role: "user",
    status: "active",
  });
  
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!userId) {
      setLoading(false);
      return;
    }
    const fetchUser = async () => {
      try {
        const res = await fetch(`http://localhost:4000/api/admin/user/${userId}`);
        if (res.ok) {
          const data = await res.json();
          
          let formattedDob = "";
          if (data.dob) {
            formattedDob = new Date(data.dob).toISOString().split("T")[0];
          }

          setFormData({
            email: data.email || "",
            fullName: data.fullName || "",
            phone: data.phone || "",
            dob: formattedDob, 
            role: data.role || "user",
            status: data.status || "active",
          });
        } else {
          alert("Không tìm thấy người dùng!");
          navigate("/admin/users");
        }
      } catch (error) {
        console.error("Lỗi:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, [userId, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`http://localhost:4000/api/admin/user/${userId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        alert("Cập nhật thành công!");
        navigate("/admin/users");
      } else {
        alert("Lỗi cập nhật!");
      }
    } catch (error) {
      console.error(error);
      alert("Lỗi Server!");
    }
  };

  if (!userId) return <div className="adminuser-error">Lỗi: Không tìm thấy ID người dùng!</div>;
  if (loading) return <div className="adminuser-loading">Đang tải thông tin...</div>;

  return (
    <div className="adminuser-container">
      <div className="adminuser-form-card">
        <h2 className="adminuser-title" style={{ textAlign: "center", border: "none" }}>Chỉnh sửa người dùng</h2>
        
        <form onSubmit={handleSubmit}>
          
          <div className="adminuser-form-group">
            <label className="adminuser-label">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="adminuser-input"
              required
            />
          </div>

          <div className="adminuser-form-group">
            <label className="adminuser-label">Họ và Tên</label>
            <input
              type="text"
              name="fullName"
              value={formData.fullName}
              onChange={handleChange}
              className="adminuser-input"
              required
            />
          </div>

          <div className="adminuser-form-group">
            <label className="adminuser-label">Ngày sinh</label>
            <input
              type="date"
              name="dob"
              value={formData.dob}
              onChange={handleChange}
              className="adminuser-input"
            />
          </div>

          <div className="adminuser-form-group">
            <label className="adminuser-label">Số điện thoại</label>
            <input
              type="text"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              className="adminuser-input"
            />
          </div>

          <div className="adminuser-form-group">
            <label className="adminuser-label">Vai trò (Role)</label>
            <select
              name="role"
              value={formData.role}
              onChange={handleChange}
              className="adminuser-select"
            >
              <option value="user">User</option>
              <option value="admin">VipMember</option>
              <option value="staff">Member</option>
            </select>
          </div>

          <div className="adminuser-form-group">
            <label className="adminuser-label">Trạng thái</label>
            <select
              name="status"
              value={formData.status}
              onChange={handleChange}
              className="adminuser-select"
            >
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
              <option value="banned">Banned</option>
            </select>
          </div>

          <div className="adminuser-btn-group">
            <button type="submit" className="adminuser-btn-save">
              Lưu thay đổi
            </button>
            <Link to="/admin/users" className="adminuser-btn-cancel">
              Hủy bỏ
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}