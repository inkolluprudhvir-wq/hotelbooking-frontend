import { Link, NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "./Navbar.css";

function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <nav className="navbar">
      <Link to="/" className="navbar-logo">
        🏨 StayNest
      </Link>

      <div className="navbar-links">
        <NavLink to="/" end>Home</NavLink>
        <NavLink to="/hotels">Hotels</NavLink>
        <NavLink to="/mybookings">My Bookings</NavLink>
        <NavLink to="/favourites">Favourites</NavLink>

        {/* Admin link available in navbar */}
        <NavLink to="/admin">Admin Dashboard</NavLink>

        {user ? (
          <>
            <span className="nav-user">
              Hi, {user.name}
            </span>

            <button
              className="logout-btn"
              onClick={handleLogout}
            >
              Logout
            </button>
          </>
        ) : (
          <>
            <NavLink to="/login">Login</NavLink>
            <NavLink to="/register">Register</NavLink>
          </>
        )}
      </div>
    </nav>
  );
}

export default Navbar;