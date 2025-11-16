import { Outlet } from "react-router-dom";
import Header from "./Header_admin";
import Footer from "./Footer_admin";
import { useAuth } from "../../context/authContext";
import Loading from "../Loading/Loading";
import { Navigate } from "react-router-dom";

export default function Layout_admin() {
  const { isLoggedIn, loading } = useAuth();

    if (loading) return <Loading />;
    if (!isLoggedIn) return <Navigate to="/admin/login" replace />;

  return (
    <div>
      <Header />
      <main>
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}
