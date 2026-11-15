
import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import api from "../services/api";
import HotelReviews from "../components/HotelReviews";
import "./HotelDetails.css";

function HotelDetails() {
  const { id } = useParams();

  const [hotel, setHotel] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchHotel() {
      try {
        setLoading(true);
        setError("");

        const response = await api.get(`/hotels/${id}`);
        setHotel(response.data);
      } catch (err) {
        console.error("Hotel details error:", err);
        setError("Unable to load hotel details.");
      } finally {
        setLoading(false);
      }
    }

    fetchHotel();
  }, [id]);

  if (loading) {
    return (
      <h2 className="details-message">
        Loading hotel details...
      </h2>
    );
  }

  if (error || !hotel) {
    return (
      <div className="details-message">
        <h2>{error || "Hotel not found"}</h2>

        <Link to="/hotels" className="back-btn">
          Back to Hotels
        </Link>
      </div>
    );
  }

  return (
    <div className="details-page">

      {/* HOTEL IMAGE */}
      <div className="details-image">
        <img
          src={hotel.image}
          alt={hotel.name}
        />
      </div>

      {/* HOTEL INFORMATION */}
      <div className="details-content">

        <h1>{hotel.name}</h1>

        <p className="details-location">
          📍 {hotel.location}
        </p>

        <div className="details-rating">
          ⭐ {hotel.rating || "Not rated"}
        </div>

        <h2 className="details-price">
          ₹{hotel.price}
          <span> / night</span>
        </h2>

        <hr />

        {/* ABOUT HOTEL */}
        <h2>About This Hotel</h2>

        <p className="details-description">
          {hotel.description || "No description available."}
        </p>

        {/* HOTEL INFORMATION */}
        <h2>Hotel Information</h2>

        <div className="details-info-grid">

          <div>
            <strong>Category</strong>
            <p>{hotel.category || "Hotel"}</p>
          </div>

          <div>
            <strong>Location</strong>
            <p>{hotel.location}</p>
          </div>

          <div>
            <strong>Check In</strong>
            <p>{hotel.checkIn || "12:00 PM"}</p>
          </div>

          <div>
            <strong>Check Out</strong>
            <p>{hotel.checkOut || "11:00 AM"}</p>
          </div>

          <div>
            <strong>Best Time To Visit</strong>
            <p>{hotel.bestTimeToVisit || "Not available"}</p>
          </div>

          <div>
            <strong>Duration</strong>
            <p>{hotel.duration || "Not available"}</p>
          </div>

          <div>
            <strong>Famous For</strong>
            <p>{hotel.famousFor || "Not available"}</p>
          </div>

          <div>
            <strong>Weather</strong>
            <p>{hotel.weather || "Not available"}</p>
          </div>

        </div>

        {/* AMENITIES */}
        <h2>Amenities</h2>

        <div className="amenities-list">

          {Array.isArray(hotel.amenities) &&
          hotel.amenities.length > 0 ? (
            hotel.amenities.map((item, index) => (
              <span key={`${item}-${index}`}>
                ✓ {item}
              </span>
            ))
          ) : (
            <p>Amenities information not available.</p>
          )}

        </div>

        {/* NEARBY PLACES */}
        <h2>Nearby Places</h2>

        <div className="amenities-list">

          {Array.isArray(hotel.nearbyPlaces) &&
          hotel.nearbyPlaces.length > 0 ? (
            hotel.nearbyPlaces.map((place, index) => (
              <span key={`${place}-${index}`}>
                📍 {place}
              </span>
            ))
          ) : (
            <p>Nearby places information not available.</p>
          )}

        </div>

        {/* ACTION BUTTONS */}
        <div className="details-actions">

          <Link to="/hotels" className="back-btn">
            Back to Hotels
          </Link>

          <Link
            to={`/book/${hotel.id}`}
            className="details-book-btn"
          >
            Book Now
          </Link>

        </div>

      </div>

      {/* HOTEL REVIEWS */}
      <div className="hotel-reviews-wrapper">
        <HotelReviews hotelId={hotel.id} />
      </div>

    </div>
  );
}

export default HotelDetails;
