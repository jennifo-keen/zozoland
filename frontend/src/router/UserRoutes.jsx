import { Route } from "react-router-dom";
import Layout from "../user/components/Layout/Layout";
import Home from "../user/pages/Home/Home";
import About from "../user/pages/About";
import Login from "../user/pages/Login/Login"
import ZooAreas from "../user/pages/ZooAreas/ZooAreas";
import AreaDetail from "../user/pages/AreaDetail/AreaDetail";
export function UserRoutes() {
  return (
    <>
    <Route path="/" element={<Layout />}>
      <Route index element={<Home />} />
      <Route path="about" element={<About />} />
      <Route path="zooareas" element={<ZooAreas />} />
      <Route path="/areas/:idOrSlug" element={<AreaDetail />} />
    </Route>
    <Route path="login" element={<Login />} />
    </>
  );
}
