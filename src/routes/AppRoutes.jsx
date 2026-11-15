
import { Routes, Route } from "react-router-dom";

import Home from "../pages/Home";
import Hotels from "../pages/Hotels";
import HotelDetails from "../pages/HotelDetails";
import Booking from "../pages/Booking";
import MyBookings from "../pages/MyBookings";
import AddHotel from "../pages/AddHotel";
import EditHotel from "../pages/EditHotel";
import Register from "../pages/Register";
import Login from "../pages/Login";
import ProtectedRoute from "./ProtectedRoute";
import Logout from "../pages/Logout";
import Favorites from "../pages/Favorites";


function AppRoutes() {
  return (
    <Routes>

      <Route path="/" element={<Home />} />

      <Route path="/hotels" element={<Hotels />} />

      <Route path="/hotels/:id" element={<HotelDetails />} />

      <Route
        path="/booking/:id"
        element={
          <ProtectedRoute>
            <Booking />
          </ProtectedRoute>
        }
      />

      <Route
        path="/mybookings"
        element={
          <ProtectedRoute>
            <MyBookings />
          </ProtectedRoute>
        }
      />

      <Route
        path="/add-hotel"
        element={
          <ProtectedRoute>
            <AddHotel />
          </ProtectedRoute>
        }
      />

      <Route
        path="/edit-hotel/:id"
        element={
          <ProtectedRoute>
            <EditHotel />
          </ProtectedRoute>
        }
      />

      <Route path="/register" element={<Register />} />

      <Route path="/login" element={<Login />} />
      <Route
  path="/logout"
  element={<Logout />}
/>
<Route
  path="/favorites"
  element={<Favorites />}
/>


    </Routes>
  );
}

export default AppRoutes;
