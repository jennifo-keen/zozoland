import React, { useState } from "react";
import "./editpassword.css";

export default function EditPassword({ userId }) {
    const [formData, setFormData] = useState({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
    });

    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
        setError("");
        setSuccess("");
    };

    const handleSubmit = async () => {
        if (formData.newPassword !== formData.confirmPassword) {
            setError("❌ Mật khẩu mới không khớp.");
            return;
        }
        try {
            const res = await fetch(`http://localhost:4000/api/userinfo/${userId}/changepassword`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
            });

            const result = await res.json();

            if (!res.ok) throw new Error(result.error || "Cập nhật mật khẩu thất bại");

            setSuccess("✅ Mật khẩu đã được cập nhật thành công!");
            setFormData({ currentPassword: "", newPassword: "", confirmPassword: "" });
        } catch (err) {
            console.error("Lỗi:", err);
            setError(err.message || "Có lỗi xảy ra. Vui lòng thử lại.");
        }
    };

    return (
        <div className="editpass-box">
            <h2>Đổi Mật Khẩu</h2>

            {error && <p className="error-message">{error}</p>}
            {success && <p className="success-message">{success}</p>}

            <div className="user-info-row">
                <strong>Mật Khẩu Hiện Tại:</strong>
                <input
                    type="password"
                    name="currentPassword"
                    value={formData.currentPassword}
                    onChange={handleChange}
                />
            </div>

            <div className="user-info-row">
                <strong>Mật Khẩu Mới:</strong>
                <input
                    type="password"
                    name="newPassword"
                    value={formData.newPassword}
                    onChange={handleChange}
                />
            </div>
            <div className="user-info-row">
                <strong>Xác Nhận Mật Khẩu Mới:</strong>
                <input
                    type="password"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                />
            </div>

            <div className="button-row">
                <button className="update-password-button" onClick={handleSubmit}>
                    Cập Nhật Mật Khẩu
                </button>
            </div>
        </div>
    );
}
