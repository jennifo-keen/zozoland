import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Loading from "../../components/Loading/Loading";
import "./ManageAdmin.css";

export default function ManageAdmin() {
    const [loading, setLoading] = useState(false);
    const [admins, setAdmins] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        const getAllAdmin = async () => {
        setLoading(true);
        try {
            const response = await fetch("http://localhost:4000/api/admin/admin", {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
            });
            const data = await response.json();
            if (data.success) {
            setAdmins(data.data); 
            }
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
        };

        getAllAdmin();
    }, []);

    if (loading) return <Loading />;

    const handleAddAdmin = () => {
        navigate("/admin/admin/add");
    }

    return (
        <div className="manage-admin-container">
            <h1 style={{textAlign: 'center'}}>Quản lý Admin</h1>
            <button className="manage-admin-button" onClick={handleAddAdmin}>
                <img style={{width: '15px', height: '15px'}} src="/add.png"/>
                Thêm quản trị viên
            </button>
            <table className="admin-table">
                <thead>
                <tr>
                    <th>STT</th>
                    <th>Email</th>
                    <th>Vai trò </th>
                    <th>Trạng thái</th>
                    <th>Hành động</th>
                </tr>
                </thead>
                <tbody>
                {admins.map((admin, index) => (
                    <tr key={admin._id}>
                    <td>{index + 1}</td>
                    <td>{admin.email}</td>
                    <td>{admin.role}</td>
                    <td>{admin.status}</td>
                    <td>
                        <button
                        className="btn-detail"
                        onClick={() => navigate(`/admin/admin/${admin._id}`)}
                        >
                        Xem chi tiết
                        </button>
                    </td>
                    </tr>
                ))}
                {admins.length === 0 && (
                    <tr>
                    <td colSpan="6">Không có dữ liệu</td>
                    </tr>
                )}
                </tbody>
            </table>
        </div>
    );
}
