export default function LogoutConfirm() {
  const handleLogout = () => {
    localStorage.clear();
    sessionStorage.clear();
    window.dispatchEvent(new Event("auth-changed"));
    window.location.href = "/login";
  };

  return (
    <div className="logout-box">
      <p>Bạn có chắc muốn đăng xuất không?</p>
      <button onClick={handleLogout}>Xác nhận</button>
    </div>
  );
}