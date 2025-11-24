import { Route } from "react-router-dom";
import AdminLogin from "../admin/pages/Login/Login";
import Home_Admin from "../admin/pages/Home_admin/Home_admin";

export function AdminRoutes() {
  return (
    <>
      <Route path="/admin/login" element={<AdminLogin />} />
      <Route path="/admin" element={<Home_Admin />} />
    </>
  );
}
