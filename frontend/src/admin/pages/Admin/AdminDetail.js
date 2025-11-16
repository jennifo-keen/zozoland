import React, { useState, useEffect } from "react";
import "./AdminDetail.css";
import Loading from "../../components/Loading/Loading";
import { useParams, useNavigate } from "react-router-dom";

export default function AdminDetail() {
    const [admin, setAdmin] = useState(null);
    const [loading, setLoading] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [editForm, setEditForm] = useState({});
    const { id } = useParams();
    const navigate = useNavigate();

    useEffect(() => {
        const getAdminDetail = async () => {
        setLoading(true);
        try {
            const response = await fetch(`http://localhost:4000/api/admin/admin/${id}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
            });

            const data = await response.json();
            if (data.success) {
            setAdmin(data.data);
            setEditForm({
                name: data.data.name,
                email: data.data.email,
                role: data.data.role,
                status: data.data.status,
                note: data.data.note || "",
            });
            } else {
            alert(data.message || "Không tìm thấy admin");
            navigate("/admin/admin");
            }
        } catch (err) {
            console.error(err);
            alert("Lỗi server!");
            navigate("/admin/admin");
        } finally {
            setLoading(false);
        }
        };

        getAdminDetail();
    }, [id, navigate]);

    const handleEdit = () => {
        setIsEditing(true);
    };

    const handleCancelEdit = () => {
        setIsEditing(false);
        setEditForm({
        name: admin.name,
        email: admin.email,
        role: admin.role,
        note: admin.note || "",
        });
    };

    const handleInputChange = (field, value) => {
        setEditForm((prev) => ({
        ...prev,
        [field]: value,
        }));
    };

    const handleSaveEdit = async () => {
        setLoading(true);
        try {
        const response = await fetch(`http://localhost:4000/api/admin/admin/${id}`, {
            method: "PUT",
            headers: {
            "Content-Type": "application/json",
            },
            body: JSON.stringify(editForm),
        });

        const data = await response.json();
        if (data.success) {
            setAdmin({ ...admin, ...editForm });
            setIsEditing(false);
            alert("Cập nhật thành công!");
        } else {
            alert(data.message || "Cập nhật thất bại");
        }
        } catch (err) {
        console.error(err);
        alert("Lỗi server!");
        } finally {
        setLoading(false);
        }
    };

    const handleDelete = async () => {
        setLoading(true);
        try {
        const response = await fetch(`http://localhost:4000/api/admin/admin/${id}`, {
            method: "DELETE",
            headers: {
            "Content-Type": "application/json",
            },
        });

        const data = await response.json();
        if (data.success) {
            alert("Xóa admin thành công!");
            navigate("/admin/admin");
        } else {
            alert(data.message || "Xóa admin thất bại");
        }
        } catch (err) {
        console.error(err);
        alert("Lỗi server khi xóa admin!");
        } finally {
        setLoading(false);
        setShowDeleteModal(false);
        }
    };

    const getRoleBadgeClass = (role) => {
        switch (role) {
        case "superadmin":
            return "badge-superadmin";
        case "admin":
            return "badge-admin";
        case "staff":
            return "badge-staff";
        default:
            return "badge-default";
        }
    };

    const getStatusBadgeClass = (status) => {
        return status === "active" ? "badge-active" : "badge-inactive";
    };

    if (loading) return <Loading />;

    if (!admin) return <p>Không có dữ liệu</p>;

    return (
        <div className="admin-detail-container">
            <div className="detail-header">
                <div>
                <button className="btn-back" onClick={() => navigate("/admin/admin")}>
                    <img style={{height: '15px', width: '20px'}} src="/left-arrow.png" alt="back" />
                    Quay lại
                </button>
                <h1>Chi tiết quản trị viên</h1>
                </div>
                <div className="action-buttons">
                {!isEditing ? (
                    <>
                    <button className="btn-edit" onClick={handleEdit}>
                        <img style={{height: '20px', width: '20px'}} src="/edit.png" alt="edit" />
                        Chỉnh sửa
                    </button>
                    <button className="btn-delete" onClick={() => setShowDeleteModal(true)}>
                        <img style={{height: '20px', width: '20px'}} src="/delete.png" alt="back" />
                        Xóa
                    </button>
                    </>
                ) : (
                    <>
                    <button className="btn-save" onClick={handleSaveEdit}>
                        <img style={{height: '20px', width: '20px'}} src="/check.png" alt="check" />
                        Lưu thay đổi
                    </button>
                    <button className="btn-cancel-edit" onClick={handleCancelEdit}>
                        <img style={{height: '20px', width: '20px'}} src="/close.png" alt="back" />
                        Hủy
                    </button>
                    </>
                )}
                </div>
            </div>

            <div className={`admin-detail-card ${isEditing ? 'editing-mode' : ''}`}>
                <div className="card-section">
                <h3 className="section-title">Thông tin cơ bản</h3>
                <div className="info-grid">
                    <div className="info-item">
                    <span className="info-label">ID:</span>
                    <span className="info-value">{admin._id}</span>
                    </div>
                    
                    <div className="info-item">
                    <span className="info-label">Tên:</span>
                    {isEditing ? (
                        <input
                        type="text"
                        className="edit-input"
                        value={editForm.name}
                        onChange={(e) => handleInputChange("name", e.target.value)}
                        />
                    ) : (
                        <span className="info-value">{admin.name}</span>
                    )}
                    </div>

                    <div className="info-item">
                    <span className="info-label">Email:</span>
                    {isEditing ? (
                        <input
                        type="email"
                        className="edit-input"
                        value={editForm.email}
                        onChange={(e) => handleInputChange("email", e.target.value)}
                        />
                    ) : (
                        <span className="info-value">{admin.email}</span>
                    )}
                    </div>

                    <div className="info-item">
                    <span className="info-label">Role:</span>
                    {isEditing ? (
                        <select
                        className="edit-select"
                        value={editForm.role}
                        onChange={(e) => handleInputChange("role", e.target.value)}
                        >
                        <option value="staff">Staff</option>
                        <option value="admin">Admin</option>
                        <option value="superadmin">Superadmin</option>
                        </select>
                    ) : (
                        <span className={`badge ${getRoleBadgeClass(admin.role)}`}>
                        {admin.role}
                        </span>
                    )}
                    </div>

                    <div className="info-item">
                    <span className="info-label">Trạng thái:</span>
                        <span className={`badge ${getStatusBadgeClass(admin.status)}`}>
                        {admin.status}
                        </span>
                    </div>
                </div>
                </div>

                <div className="card-section">
                <h3 className="section-title">Ghi chú</h3>
                {isEditing ? (
                    <textarea
                    className="edit-textarea"
                    value={editForm.note}
                    onChange={(e) => handleInputChange("note", e.target.value)}
                    placeholder="Nhập ghi chú..."
                    rows="4"
                    />
                ) : (
                    <div className="note-content">
                    {admin.note || "Không có ghi chú"}
                    </div>
                )}
                </div>

                <div className="card-section">
                <h3 className="section-title">Thông tin khác</h3>
                <div className="info-grid">
                    <div className="info-item">
                    <span className="info-label">Ngày tạo:</span>
                    <span className="info-value">
                        {new Date(admin.createdAt).toLocaleString("vi-VN")}
                    </span>
                    </div>
                    <div className="info-item">
                    <span className="info-label">Cập nhật lần cuối:</span>
                    <span className="info-value">
                        {new Date(admin.updatedAt).toLocaleString("vi-VN")}
                    </span>
                    </div>
                </div>
                </div>
            </div>

            {showDeleteModal && (
                <div className="modal-overlay" onClick={() => setShowDeleteModal(false)}>
                <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                    <div className="modal-header">
                    <img style={{height: '15px', width: '20px'}} src="/delete.png" alt="back" />
                    <h2>Xác nhận xóa</h2>
                    <p>Bạn có chắc chắn muốn xóa quản trị viên <strong>{admin.name}</strong>?</p>
                    <p className="warning-text">Hành động này không thể hoàn tác!</p>
                    </div>
                    <div className="modal-actions">
                    <button className="btn-cancel" onClick={() => setShowDeleteModal(false)}>
                        Hủy
                    </button>
                    <button className="btn-confirm-delete" onClick={handleDelete}>
                        Xóa
                    </button>
                    </div>
                </div>
                </div>
            )}
        </div>
    );
}