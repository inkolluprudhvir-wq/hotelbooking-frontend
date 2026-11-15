import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../services/api";
import "./Booking.css";

function getToday() {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, "0");
  const day = String(today.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

function calculateAvailableRooms(totalRooms, bookings, checkIn, checkOut) {
  const bookedRooms = bookings
    .filter((booking) => {
      if (booking.status === "cancelled") return false;

      // Checkout date is exclusive: same-day checkout/check-in is allowed.
      return booking.checkIn < checkOut && booking.checkOut > checkIn;
    })
    .reduce((total, booking) => {
      return total + Number(booking.rooms || 1);
    }, 0);

  return Math.max(0, Number(totalRooms || 0) - bookedRooms);
}

function Booking() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [hotel, setHotel] = useState(null);
  const [name, setName] = useState("");
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [guests, setGuests] = useState("1");
  const [rooms, setRooms] = useState("1");

  const [availableRooms, setAvailableRooms] = useState(null);
  const [checkingAvailability, setCheckingAvailability] = useState(false);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  // Load hotel information
  useEffect(() => {
    async function fetchHotel() {
      try {
        setLoading(true);
        const response = await api.get(`/hotels/${id}`);
        setHotel(response.data);
      } catch (err) {
        console.error(err);
        setError("Unable to load hotel information.");
      } finally {
        setLoading(false);
      }
    }

    fetchHotel();
  }, [id]);

  // Check room availability for selected dates
  useEffect(() => {
    if (!hotel || !checkIn || !checkOut || checkOut <= checkIn) {
      setAvailableRooms(null);
      return;
    }

    let active = true;

    async function checkAvailability() {
      try {
        setCheckingAvailability(true);
        setError("");

        const response = await api.get(`/bookings?hotelId=${id}`);

        const available = calculateAvailableRooms(
          hotel.rooms,
          response.data,
          checkIn,
          checkOut
        );

        if (active) {
          setAvailableRooms(available);
        }
      } catch (err) {
        console.error(err);

        if (active) {
          setAvailableRooms(null);
          setError("Unable to check room availability. Try again.");
        }
      } finally {
        if (active) {
          setCheckingAvailability(false);
        }
      }
    }

    checkAvailability();

    return () => {
      active = false;
    };
  }, [hotel, id, checkIn, checkOut]);

  async function handleBooking(e) {
    e.preventDefault();
    setError("");

    if (!hotel) {
      setError("Hotel information is not available.");
      return;
    }

    if (checkIn < getToday()) {
      setError("Check-in date cannot be in the past.");
      return;
    }

    if (checkOut <= checkIn) {
      setError("Check-out must be after check-in.");
      return;
    }

    if (Number(rooms) < 1 || Number(guests) < 1) {
      setError("Please select valid room and guest numbers.");
      return;
    }

    if (Number(rooms) > Number(hotel.rooms || 0)) {
      setError("Requested rooms exceed the hotel's total rooms.");
      return;
    }

    try {
      setSubmitting(true);

      // Recheck availability before saving the booking
      const response = await api.get(`/bookings?hotelId=${id}`);

      const latestAvailable = calculateAvailableRooms(
        hotel.rooms,
        response.data,
        checkIn,
        checkOut
      );

      if (Number(rooms) > latestAvailable) {
        setAvailableRooms(latestAvailable);
        setError(
          latestAvailable === 0
            ? "Sorry! No rooms are available for these dates."
            : `Only ${latestAvailable} room(s) available for these dates.`
        );
        return;
      }

      await api.post("/bookings", {
        hotelId: id,
        hotelName: hotel.name,
        name: name.trim(),
        checkIn,
        checkOut,
        guests: Number(guests),
        rooms: Number(rooms),
        status: "confirmed",
        createdAt: new Date().toISOString()
      });

      alert("Booking Successful!");
      navigate("/mybookings");
    } catch (err) {
      console.error("Booking error:", err);
      setError("Booking failed. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  if (loading) {
    return <div className="booking-message">Loading hotel...</div>;
  }

  if (!hotel) {
    return (
      <div className="booking-message">
        {error || "Hotel not found."}
      </div>
    );
  }

  const invalidDates = checkIn && checkOut && checkOut <= checkIn;
  const cannotBook =
    submitting ||
    checkingAvailability ||
    availableRooms === null ||
    Number(rooms) > availableRooms ||
    invalidDates;

  return (
    <div className="booking-page">
      <div className="booking-container">
        <div className="booking-header">
          <span className="booking-label">STAYNEST RESERVATIONS</span>
          <h1>Book Your Stay</h1>
          <p>Complete your details and reserve your perfect getaway.</p>
        </div>

        <div className="booking-hotel-summary">
          <div>
            <h2>{hotel.name}</h2>
            <p>📍 {hotel.location}</p>
          </div>

          <div className="booking-hotel-price">
            <strong>₹{hotel.price}</strong>
            <span>/ night</span>
          </div>
        </div>

        <form className="booking-form" onSubmit={handleBooking}>
          <div className="booking-field">
            <label htmlFor="guestName">Full Name</label>
            <input
              id="guestName"
              type="text"
              placeholder="Enter your name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

          <div className="booking-date-grid">
            <div className="booking-field">
              <label htmlFor="checkIn">Check-in Date</label>
              <input
                id="checkIn"
                type="date"
                min={getToday()}
                value={checkIn}
                onChange={(e) => {
                  setCheckIn(e.target.value);
                  if (checkOut && e.target.value >= checkOut) {
                    setCheckOut("");
                  }
                }}
                required
              />
            </div>

            <div className="booking-field">
              <label htmlFor="checkOut">Check-out Date</label>
              <input
                id="checkOut"
                type="date"
                min={checkIn || getToday()}
                value={checkOut}
                onChange={(e) => setCheckOut(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="booking-date-hint">
            Select your dates to check room availability.
          </div>

          {checkingAvailability && (
            <div className="availability-box checking">
              Checking available rooms...
            </div>
          )}

          {!checkingAvailability && availableRooms !== null && (
            <div
              className={`availability-box ${
                availableRooms > 0 ? "available" : "unavailable"
              }`}
            >
              {availableRooms > 0
                ? `✓ ${availableRooms} room(s) available for your selected dates`
                : "✕ Sorry! No rooms available for these dates."}
            </div>
          )}

          <div className="booking-date-grid">
            <div className="booking-field">
              <label htmlFor="guests">Number of Guests</label>
              <input
                id="guests"
                type="number"
                min="1"
                value={guests}
                onChange={(e) => setGuests(e.target.value)}
                required
              />
            </div>

            <div className="booking-field">
              <label htmlFor="rooms">Number of Rooms</label>
              <input
                id="rooms"
                type="number"
                min="1"
                max={hotel.rooms || 1}
                value={rooms}
                onChange={(e) => setRooms(e.target.value)}
                required
              />
            </div>
          </div>

          {error && (
            <div className="booking-error">
              {error}
            </div>
          )}

          <button
            type="submit"
            className="confirm-booking-btn"
            disabled={cannotBook}
          >
            {submitting ? "Confirming..." : "Confirm Booking"}
            <BookingInvoice booking={booking} />

<BookingQR booking={booking} />
          </button>
        </form>
      </div>
    </div>
  );
}

export default Booking;