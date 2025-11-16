import React, { useState, useEffect, useRef } from "react";
import { useAuth } from "../../context/authContext";
import { useNavigate } from "react-router-dom";
import "./Header_admin.css";

export default function Header() {
  const { user, logout } = useAuth();
  const [openNav, setOpenNav] = useState(null);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const navigate = useNavigate();
  const dropdownRef = useRef(null);
  const userMenuRef = useRef(null);

  const handleLogout = () => {
    logout();
    navigate("/admin/login");
  };

  const menuByRole = {
    superadmin: [
      {
        parent: "Quản lý quản trị viên",
        children: [
          { name: "Danh sách quản trị viên", link: "/admin/admin" },
          { name: "Thêm quản trị viên", link: "/admin/admin/add" },
        ],
      },
      {
        parent: "Quản lý đơn hàng",
        children: [
          { name: "Danh sách đơn hàng", link: "/admin/orders/list" },
          { name: "Báo cáo", link: "/admin/orders/report" },
        ],
      },
      {
        parent: "Quản lý người dùng",
        children: [
          { name: "Danh sách người dùng", link: "/admin/users/list" },
          { name: "Người dùng mới", link: "/admin/users/add" },
          { name: "Báo cáo", link: "/admin/users/report" },
        ],
      },
      {
        parent: "Báo cáo doanh thu",
        children: [{ name: "Báo cáo", link: "/admin/report" }],
      },
    ],

    admin: [
      {
        parent: "Quản lý người dùng",
        children: [
          { name: "Danh sách người dùng", link: "/admin/users/list" },
          { name: "Người dùng mới", link: "/admin/users/add" },
        ],
      },
      {
        parent: "Báo cáo & thống kê",
        children: [
          { name: "Doanh thu", link: "/admin/report/revenue" },
          { name: "Người dùng hoạt động", link: "/admin/report/active-users" },
        ],
      },
    ],

    staff: [
      {
        parent: "Người dùng",
        children: [
          { name: "Danh sách người dùng", link: "/admin/users/list" },
        ],
      },
    ],
  };

  const currentMenu = menuByRole[user?.role] || [];

  const toggleNav = (index) => {
    setOpenNav(openNav === index ? null : index);
  };

  const handleNavigate = (link) => {
    navigate(link);
    setOpenNav(null);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setOpenNav(null);
      }
      if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
        setShowUserMenu(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <header className="admin-header">
      <div className="header-container">
        <div className="header-logo">
          <img
            style={{width: '100px', height: '100px'}}
            onClick={() => navigate("/admin/dashboard")}
            src="/logo_white.svg"
            alt="ZozoLand Admin Logo"
          />
        </div>

        <nav className="header-nav" ref={dropdownRef}>
          <ul className="nav-list">
            {currentMenu.map((item, index) => (
              <li key={index} className="nav-item">
                <button
                  className={`nav-button ${openNav === index ? "active" : ""}`}
                  onClick={() => toggleNav(index)}
                >
                  {item.parent}
                  <img className={`chevron ${openNav === index ? "rotate" : ""}`} style={{height: '20px', width: '20px'}} src='/arrow.png' />
                </button>

                {/* Dropdown */}
                {openNav === index && (
                  <ul className="dropdown-menu">
                    {item.children.map((child, childIndex) => (
                      <li key={childIndex} className="dropdown-item">
                        <button
                          onClick={() => handleNavigate(child.link)}
                          className="dropdown-link"
                        >
                          {child.name}
                        </button>
                      </li>
                    ))}
                  </ul>
                )}
              </li>
            ))}
          </ul>
        </nav>

        {/* User Menu */}
        <div className="header-user" ref={userMenuRef}>
          <button
            className="user-button"
            onClick={() => setShowUserMenu(!showUserMenu)}
          >
            <div className="user-avatar">
              {user?.name?.charAt(0).toUpperCase() || "A"}
            </div>
            <div className="user-info">
              <span className="user-name">{user?.name || "Admin"}</span>
              <span className="user-role">{user?.role || "staff"}</span>
            </div>
          </button>

          {showUserMenu && (
            <div className="user-dropdown">
              <div className="user-dropdown-header">
                <p className="user-email">{user?.email}</p>
              </div>
              <ul className="user-dropdown-menu">
                <li>
                  <button
                    onClick={() => {
                      navigate(`/admin/profile/${user._id}`);
                      setShowUserMenu(false);
                    }}
                  >
                    <img style={{height: '20px', width: '20px'}} src='/people.png' />
                    Hồ sơ cá nhân
                  </button>
                </li>
                <li>
                  <button onClick={handleLogout} className="logout-button">
                    <img style={{height: '20px', width: '20px'}} src='/logout.png' />
                    Đăng xuất
                  </button>
                </li>
              </ul>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}