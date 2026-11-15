
import { Routes, Route } from "react-router-dom";

import { FavouriteProvider } from "./context/FavouriteContext";
import { AuthProvider } from "./context/AuthContext";

import Navbar from "./components/Navbar";
import ProtectedRoute from "./components/ProtectedRoute";

import Home from "./pages/Home";
import Hotels from "./pages/Hotels";
import Search from "./pages/Search";
import Favourites from "./pages/Favourites";
import HotelDetails from "./pages/HotelDetails";
import MyBookings from "./pages/MyBookings";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Booking from "./pages/Booking";
import CheckIn from "./pages/CheckIn";
import AdminDashboard from "./pages/AdminDashboard";
function App() {
  return (
    <AuthProvider>
      <FavouriteProvider>
        <Navbar />

        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Home />} />
          <Route path="/hotels" element={<Hotels />} />
          <Route path="/hotels/:id" element={<HotelDetails />} />
          <Route path="/search" element={<Search />} />
          <Route path="/favourites" element={<Favourites />} />

          {/* Authentication Routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Protected Routes */}
          <Route element={<ProtectedRoute />}>
            <Route path="/mybookings" element={<MyBookings />} />
            <Route path="/book/:id" element={<Booking />} />
            <Route path="/checkin" element={<CheckIn />} />
            <Route path="/admin" element={<AdminDashboard />} />
          </Route>
        </Routes>

      </FavouriteProvider>
    </AuthProvider>
  );
}

export default App;
