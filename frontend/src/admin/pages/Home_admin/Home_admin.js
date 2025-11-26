import React, { useState, useEffect } from "react";
import "./Home_admin.css";

export default function Dashboard() {
  const [time, setTime] = useState(new Date());
  const [greeting, setGreeting] = useState("");

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    
    const hour = new Date().getHours();
    if (hour < 12) setGreeting("Chào buổi sáng");
    else if (hour < 18) setGreeting("Chào buổi chiều");
    else setGreeting("Chào buổi tối");
    
    return () => clearInterval(timer);
  }, []);

  const stats = [
    { label: "Sản phẩm", value: "1,234", icon: "📦", color: "blue" },
    { label: "Đơn hàng", value: "567", icon: "🛒", color: "purple" },
    { label: "Khách hàng", value: "890", icon: "👥", color: "pink" },
    { label: "Doanh thu", value: "₫45M", icon: "💰", color: "orange" }
  ];

  const quickActions = [
    { title: "Thêm sản phẩm", icon: "➕", color: "cyan" },
    { title: "Xem đơn hàng", icon: "📋", color: "purple" },
    { title: "Quản lý users", icon: "👤", color: "orange" },
    { title: "Báo cáo", icon: "📊", color: "green" }
  ];

  const notifications = [
    { text: "5 đơn hàng mới cần xử lý", time: "5 phút trước", icon: "🔔" },
    { text: "Cập nhật hệ thống thành công", time: "1 giờ trước", icon: "✅" },
    { text: "3 khách hàng mới đăng ký", time: "2 giờ trước", icon: "👤" }
  ];

  return (
    <div className="dashboard-container">
      <div className="dashboard-wrapper">
        
        {/* Welcome Hero Section */}
        <div className="hero-section">
          <div className="hero-grid-pattern"></div>
          <div className="hero-content">
            <div className="hero-emoji-wrapper">
              <div className="hero-emoji">👋</div>
            </div>
            <h1 className="hero-title">{greeting}!</h1>
            <p className="hero-subtitle">
              Chào mừng bạn đến với <span className="hero-brand">ZOZO LAND</span> Admin
            </p>
            
            <div className="hero-time-card">
              <div className="time-content">
                <div className="time-display">
                  {time.toLocaleTimeString('vi-VN')}
                </div>
                <div className="date-display">
                  {time.toLocaleDateString('vi-VN', { 
                    weekday: 'long', 
                    day: 'numeric',
                    month: 'long', 
                    year: 'numeric'
                  })}
                </div>
              </div>
              <div className="time-icon">🕐</div>
            </div>
          </div>
          
          <div className="hero-blob hero-blob-1"></div>
          <div className="hero-blob hero-blob-2"></div>
        </div>

        {/* Stats Grid */}
        <div className="stats-grid">
          {stats.map((stat, index) => (
            <div key={index} className={`stat-card stat-card-${stat.color}`}>
              <div className="stat-gradient"></div>
              <div className="stat-content">
                <div className="stat-info">
                  <div className="stat-text">
                    <p className="stat-label">{stat.label}</p>
                    <p className="stat-value">{stat.value}</p>
                  </div>
                  <div className="stat-icon">{stat.icon}</div>
                </div>
                <div className="stat-progress-container">
                  <div className={`stat-progress stat-progress-${stat.color}`}></div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="content-grid">
          
          {/* Quick Actions */}
          <div className="quick-actions-section">
            <h2 className="section-title">
              <span className="section-icon">⚡</span>
              Thao tác nhanh
            </h2>
            <div className="quick-actions-grid">
              {quickActions.map((action, index) => (
                <button key={index} className={`action-btn action-btn-${action.color}`}>
                  <div className="action-overlay"></div>
                  <div className="action-content">
                    <div className="action-icon">{action.icon}</div>
                    <p className="action-title">{action.title}</p>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Notifications */}
          <div className="notifications-section">
            <h3 className="notifications-title">
              <span className="notifications-icon">🔔</span>
              Thông báo
            </h3>
            <div className="notifications-list">
              {notifications.map((notif, index) => (
                <div key={index} className="notification-item">
                  <div className="notification-icon">{notif.icon}</div>
                  <div className="notification-content">
                    <p className="notification-text">{notif.text}</p>
                    <p className="notification-time">{notif.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* Progress Section */}
        <div className="progress-section">
          <h3 className="progress-title">
            <span className="progress-icon">🎯</span>
            Mục tiêu tháng này
          </h3>
          <div className="progress-grid">
            <div className="progress-card">
              <div className="progress-header">
                <span className="progress-name">Doanh thu</span>
                <span className="progress-percent">75%</span>
              </div>
              <div className="progress-bar-container">
                <div className="progress-bar" style={{ width: '75%' }}></div>
              </div>
              <p className="progress-detail">₫45M / ₫60M</p>
            </div>
            <div className="progress-card">
              <div className="progress-header">
                <span className="progress-name">Đơn hàng</span>
                <span className="progress-percent">60%</span>
              </div>
              <div className="progress-bar-container">
                <div className="progress-bar" style={{ width: '60%' }}></div>
              </div>
              <p className="progress-detail">567 / 950 đơn</p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}