
import { useEffect, useState } from "react";
import api from "../services/api";
import BookingInvoice from "../components/BookingInvoice";
import BookingQR from "../components/BookingQR";
import "./MyBookings.css";


function MyBookings() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [cancellingId, setCancellingId] = useState(null);

  useEffect(() => {
    getBookings();
  }, []);

  // FETCH BOOKINGS
  async function getBookings() {
    try {
      const response = await api.get("/bookings");
      setBookings(response.data);
    } catch (error) {
      console.log("Bookings fetch error:", error);
    } finally {
      setLoading(false);
    }
  }

  // CALCULATE ESTIMATED REFUND
  async function calculateRefund(booking) {
    try {
      const response = await api.get(
        `/hotels/${booking.hotelId}`
      );

      const hotel = response.data;

      const checkIn = new Date(booking.checkIn);
      const checkOut = new Date(booking.checkOut);

      const nights = Math.max(
        1,
        Math.ceil(
          (checkOut - checkIn) / (1000 * 60 * 60 * 24)
        )
      );

      const rooms = Number(booking.rooms) || 1;
      const price = Number(hotel.price) || 0;

      return nights * rooms * price;
    } catch (error) {
      console.log("Refund calculation error:", error);
      return 0;
    }
  }

  // CANCEL BOOKING
  async function cancelBooking(booking) {
    const confirmCancel = window.confirm(
      "Are you sure you want to cancel this booking?"
    );

    if (!confirmCancel) return;

    try {
      setCancellingId(booking.id);

      const refundAmount = await calculateRefund(booking);

      const updatedBooking = {
        ...booking,
        status: "cancelled",
        refundAmount,
        refundStatus: "Pending",
        cancelledAt: new Date().toISOString()
      };

      // UPDATE BOOKING STATUS
      await api.patch(
        `/bookings/${booking.id}`,
        updatedBooking
      );

      // SAVE CANCELLATION HISTORY
      try {
        await api.post("/cancellations", {
          bookingId: booking.id,
          hotelId: booking.hotelId,
          hotelName: booking.hotelName || "Hotel",
          customerName: booking.name,
          refundAmount,
          refundStatus: "Pending",
          reason: "Customer requested cancellation",
          requestedAt: new Date().toISOString()
        });
      } catch (historyError) {
        console.log(
          "Cancellation history error:",
          historyError
        );
      }

      setBookings((previousBookings) =>
        previousBookings.map((item) =>
          item.id === booking.id
            ? updatedBooking
            : item
        )
      );

      alert("Booking cancelled successfully!");
    } catch (error) {
      console.log("Cancellation error:", error);
      alert("Unable to cancel booking. Please try again.");
    } finally {
      setCancellingId(null);
    }
  }

  if (loading) {
    return (
      <div className="bookings-loading">
        Loading your bookings...
      </div>
    );
  }

  return (
    <div className="my-bookings-page">

      <div className="bookings-header">
        <h1>My Bookings</h1>
        <p>Manage your reservations with StayNest</p>
      </div>

      {bookings.length === 0 ? (
        <div className="no-bookings">
          <h2>No Bookings Found</h2>
          <p>You haven't booked any hotels yet.</p>
        </div>
      ) : (
        <div className="bookings">

          {bookings.map((booking) => (
            <div
              className="booking-card"
              key={booking.id}
            >

              <div className="booking-card-header">
                <div>
                  <h2>
                    {booking.hotelName || "Hotel Booking"}
                  </h2>

                  <p>
                    Booking ID: {booking.id}
                  </p>
                </div>

                <span
                  className={`booking-status ${
                    booking.status === "cancelled"
                      ? "status-cancelled"
                      : "status-confirmed"
                  }`}
                >
                  {booking.status || "Confirmed"}
                </span>
              </div>

              <div className="booking-details">

                <div>
                  <span>Guest Name</span>
                  <strong>{booking.name}</strong>
                </div>

                <div>
                  <span>Hotel ID</span>
                  <strong>{booking.hotelId}</strong>
                </div>

                <div>
                  <span>Check In</span>
                  <strong>{booking.checkIn}</strong>
                </div>

                <div>
                  <span>Check Out</span>
                  <strong>{booking.checkOut}</strong>
                </div>

                <div>
                  <span>Guests</span>
                  <strong>{booking.guests}</strong>
                </div>

                <div>
                  <span>Rooms</span>
                  <strong>{booking.rooms || 1}</strong>
                </div>

              </div>

              {/* INVOICE + QR + CANCELLATION */}

              <div className="booking-actions">

                {/* PDF INVOICE */}
                <BookingInvoice booking={booking} />

                {/* DIGITAL CHECK-IN QR */}
                <BookingQR booking={booking} />

                {/* CANCEL BOOKING */}
                {booking.status !== "cancelled" && (
                  <button
                    className="cancel-booking-btn"
                    onClick={() => cancelBooking(booking)}
                    disabled={cancellingId === booking.id}
                  >
                    {cancellingId === booking.id
                      ? "Cancelling..."
                      : "Cancel Booking"}
                  </button>
                )}

              </div>

              {/* REFUND TRACKER */}

              {booking.status === "cancelled" && (
                <div className="refund-tracker">

                  <h3>Refund Tracker</h3>

                  <p>
                    Estimated Refund: ₹
                    {Number(
                      booking.refundAmount || 0
                    ).toLocaleString("en-IN")}
                  </p>

                  <span className="refund-pending">
                    Refund Status:{" "}
                    {booking.refundStatus || "Pending"}
                  </span>

                  <p className="refund-note">
                    Your cancellation has been recorded.
                    The displayed refund is an estimate,
                    not a processed payment.
                  </p>

                </div>
              )}

            </div>
          ))}

        </div>
      )}

    </div>
  );
}

export default MyBookings;
