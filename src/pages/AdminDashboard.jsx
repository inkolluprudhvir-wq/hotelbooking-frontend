
import { useEffect, useState } from "react";
import api from "../services/api";
import "./AdminDashboard.css";

function AdminDashboard() {
  const [hotels, setHotels] = useState([]);
  const [users, setUsers] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboard();
  }, []);

  async function fetchDashboard() {
    try {
      const [hotelRes, userRes, bookingRes] = await Promise.all([
        api.get("/hotels"),
        api.get("/users"),
        api.get("/bookings")
      ]);

      setHotels(hotelRes.data);
      setUsers(userRes.data);
      setBookings(bookingRes.data);
    } catch (error) {
      console.error("Dashboard error:", error);
      alert("Unable to load dashboard data");
    } finally {
      setLoading(false);
    }
  }

  async function deleteHotel(id) {
    if (!window.confirm("Are you sure you want to delete this hotel?")) {
      return;
    }

    try {
      await api.delete(`/hotels/${id}`);
      setHotels(prev => prev.filter(hotel => hotel.id !== id));
      alert("Hotel deleted successfully");
    } catch (error) {
      console.error(error);
      alert("Unable to delete hotel");
    }
  }

  const confirmedBookings = bookings.filter(
    booking => booking.status !== "cancelled"
  );

  const cancelledBookings = bookings.filter(
    booking => booking.status === "cancelled"
  );

  const totalRevenue = confirmedBookings.reduce(
    (total, booking) => {
      if (booking.totalAmount != null) {
        return total + Number(booking.totalAmount || 0);
      }

      const hotel = hotels.find(
        item => String(item.id) === String(booking.hotelId)
      );

      if (!hotel) return total;

      const nights = Math.max(
        1,
        Math.ceil(
          (new Date(booking.checkOut) - new Date(booking.checkIn)) /
          (1000 * 60 * 60 * 24)
        )
      );

      return total +
        Number(hotel.price || 0) *
        Number(booking.rooms || 1) *
        nights;
    },
    0
  );

  if (loading) return <h2 className="admin-loading">Loading Dashboard...</h2>;

  return (
    <div className="admin-dashboard">
      <div className="admin-heading">
        <div>
          <p>STAYNEST MANAGEMENT</p>
          <h1>Admin Dashboard</h1>
          <span>Manage your hotel booking platform</span>
        </div>
      </div>

      <div className="admin-stats">
        <div className="admin-stat">
          <span>Total Hotels</span>
          <h2>{hotels.length}</h2>
        </div>

        <div className="admin-stat">
          <span>Total Users</span>
          <h2>{users.length}</h2>
        </div>

        <div className="admin-stat">
          <span>Total Bookings</span>
          <h2>{bookings.length}</h2>
        </div>

        <div className="admin-stat">
          <span>Confirmed Bookings</span>
          <h2>{confirmedBookings.length}</h2>
        </div>

        <div className="admin-stat">
          <span>Cancelled Bookings</span>
          <h2>{cancelledBookings.length}</h2>
        </div>

        <div className="admin-stat revenue-stat">
          <span>Estimated Booking Value</span>
          <h2>₹{totalRevenue.toLocaleString("en-IN")}</h2>
        </div>
      </div>

      <section className="admin-section">
        <div className="admin-section-title">
          <h2>Hotel Management</h2>
          <span>{hotels.length} Hotels</span>
        </div>

        <div className="admin-table-wrapper">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Hotel</th>
                <th>Location</th>
                <th>Price / Night</th>
                <th>Rating</th>
                <th>Rooms</th>
                <th>Action</th>
              </tr>
            </thead>

            <tbody>
              {hotels.map(hotel => (
                <tr key={hotel.id}>
                  <td>{hotel.name}</td>
                  <td>{hotel.location}</td>
                  <td>₹{hotel.price}</td>
                  <td>⭐ {hotel.rating}</td>
                  <td>{hotel.rooms}</td>
                  <td>
                    <button
                      className="admin-delete-btn"
                      onClick={() => deleteHotel(hotel.id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {hotels.length === 0 && <p>No hotels available.</p>}
        </div>
      </section>

      <section className="admin-section">
        <div className="admin-section-title">
          <h2>Recent Bookings</h2>
          <span>{bookings.length} Bookings</span>
        </div>

        <div className="admin-table-wrapper">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Customer</th>
                <th>Hotel</th>
                <th>Check In</th>
                <th>Check Out</th>
                <th>Status</th>
              </tr>
            </thead>

            <tbody>
              {[...bookings].reverse().slice(0, 10).map(booking => (
                <tr key={booking.id}>
                  <td>{booking.name}</td>
                  <td>
                    {booking.hotelName ||
                      hotels.find(h => String(h.id) === String(booking.hotelId))?.name ||
                      booking.hotelId}
                  </td>
                  <td>{booking.checkIn}</td>
                  <td>{booking.checkOut}</td>
                  <td>
                    <span className={
                      booking.status === "cancelled"
                        ? "admin-status cancelled"
                        : "admin-status confirmed"
                    }>
                      {booking.status || "Confirmed"}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}

export default AdminDashboard;
