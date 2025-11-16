import { Route } from "react-router-dom";
import LayoutAdmin from "../admin/components/Layout/Layout_admin";
import HomeAdmin from "../admin/pages/Home_admin/Home_admin";
import AboutAdmin from "../admin/pages/About_admin";
import BranchesAdmin from "../admin/pages/BranchesAdmin";
import LoginAdmin from "../admin/pages/Login/Login";
import ManageAdmin from "../admin/pages/Admin/ManageAdmin";
import CreateAdmin from "../admin/pages/Admin/CreateAdmin";
import AdminDetail from "../admin/pages/Admin/AdminDetail";

export function AdminRoutes() {
  return (
    <>
      <Route path="/admin/login" element={<LoginAdmin />} /> 
        <Route path="/admin" element={<LayoutAdmin />}>
          <Route index element={<HomeAdmin />} />    
          <Route path="about" element={<AboutAdmin />} /> 
          <Route path="/admin/branches" element={<BranchesAdmin />} />
          <Route path="admin" element={<ManageAdmin />} /> 
          <Route path="admin/:id" element={<AdminDetail />} /> 
          <Route path="admin/add" element={<CreateAdmin />} /> 
        </Route>
    </>
  );
}
