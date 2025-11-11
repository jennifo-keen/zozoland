import { Route } from "react-router-dom";
import Layout from "../user/components/Layout/Layout";
import Home from "../user/pages/Home/Home";
import About from "../user/pages/About";
import Login from "../user/pages/login&register/Login/Login"
import ZooAreas from "../user/pages/ZooAreas/ZooAreas";
import AreaDetail from "../user/pages/AreaDetail/AreaDetail";
import Register from "../user/pages/login&register/register/Register";
import BookingDate from "../user/pages/BookingDate/BookingDate";
import Bookingticket from "../user/pages/BookingTickets/BookingTickets";
import UserDashboard from "../user/pages/UserDashboard/UserDashBoard";
import CheckoutConfirm from "../user/pages/CheckoutConfirm/CheckoutConfirm";
export function UserRoutes() {
  return (
    <>
      <Route path="/" element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="about" element={<About />} />
        <Route path="zooareas" element={<ZooAreas />} />
        <Route path="/areas/:idOrSlug" element={<AreaDetail />} />

      </Route>
      <Route path="register" element={<Register />} />
      <Route path="login" element={<Login />} />
      <Route path="bookingDate" element={<BookingDate />} />
      <Route path="booking/tickets" element={<Bookingticket />} />
      <Route path="/dashboard/:id" element={<UserDashboard />} />
      <Route path="checkout" element={<CheckoutConfirm />} />
    </>
  );
}
