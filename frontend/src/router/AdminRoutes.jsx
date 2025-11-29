import { Routes, Route } from "react-router-dom";
import AdminLogin from "../admin/pages/Login/Login";
import Home_Admin from "../admin/pages/Home_admin/Home_admin";
import Layout_admin from "../admin/components/Layout/Layout_admin";
import ManageAdmin from "../admin/pages/Admin/ManageAdmin"
import CreateAdmin from "../admin/pages/Admin/CreateAdmin"
import AdminDetail from "../admin/pages/Admin/AdminDetail"
import AdminReport from "../admin/pages/Report/Report"
import AdminDiscount from "../admin/pages/Discount/Discount"
import AdminDiscountAdd from "../admin/pages/Discount/DiscountAdd"
import AdminUser from "../admin/pages/User/Userlist"
import AdminUsermod from "../admin/pages/User/Usermod"

export function AdminRoutes() {
  return (
    <>
      <Route path="/admin/login" element={<AdminLogin />} />
      <Route path="/admin" element={<Layout_admin />}>
        <Route index element={<Home_Admin />} />
        <Route path="admin" element={<ManageAdmin />} />
        <Route path="admin/add" element={<CreateAdmin />} />
        <Route path="admin/:id" element={<AdminDetail />} />
        <Route path="report" element={<AdminReport />} />
        <Route path="discount" element={<AdminDiscount />} />
        <Route path="discount/add" element={<AdminDiscountAdd />} />
        <Route path="user/list" element={<AdminUser />} />
        <Route path="user/mod" element={<AdminUsermod />} />
      </Route>
    </>
  );
}
