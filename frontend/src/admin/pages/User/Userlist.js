import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "./AdminUser.css"; // IMPORT FILE CSS

export default function UserList() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchUsers = async () => {
    try {
      const res = await fetch("http://localhost:4000/api/admin/user");
      const data = await res.json();
      setUsers(data);
    } catch (error) {
      console.error("Lỗi:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("Bạn chắc chắn muốn xóa user này?")) return;
    try {
      const res = await fetch(`http://localhost:4000/api/admin/user/${id}`, {
        method: "DELETE",
      });
      if (res.ok) {
        alert("Đã xóa thành công!");
        fetchUsers();
      }
    } catch (error) {
      alert("Lỗi khi xóa!");
    }
  };

  if (loading) return <div className="adminuser-loading">Đang tải dữ liệu...</div>;

  return (
    <div className="adminuser-container">
      <h1 className="adminuser-title">Quản lý người dùng</h1>
      <div className="adminuser-table-wrapper">
        <table className="adminuser-table">
          <thead className="adminuser-thead">
            <tr>
              <th className="adminuser-th">Tên</th>
              <th className="adminuser-th">Email</th>
              <th className="adminuser-th">Vai trò</th>
              <th className="adminuser-th">Trạng thái</th>
              <th className="adminuser-th" style={{ textAlign: "center" }}>Hành động</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user._id} className="adminuser-tr">
                <td className="adminuser-td"><b>{user.fullName}</b></td>
                <td className="adminuser-td">{user.email}</td>
                <td className="adminuser-td">{user.role}</td>
                <td className="adminuser-td">
                  <span className={`adminuser-status-${user.status === 'active' ? 'active' : user.status === 'banned' ? 'banned' : 'inactive'}`}>
                    {user.status}
                  </span>
                </td>
                <td className="adminuser-td" style={{ textAlign: "center" }}>
                  <Link
                    to={`/admin/user/mod?id=${user._id}`}
                    className="adminuser-btn-edit"
                  >
                    Sửa
                  </Link>
                  <button
                    onClick={() => handleDelete(user._id)}
                    className="adminuser-btn-delete"
                  >
                    Xóa
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}