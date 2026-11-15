
import { Link } from "react-router-dom";

import { useFavourites } from "../context/FavouriteContext";
import "./HotelCard.css";

function HotelCard({ hotel }) {
  const { toggleFavourite, isFavourite } = useFavourites();

  const favourite = isFavourite(hotel.id);

  return (
    <div className="hotel-card">

      {/* HOTEL IMAGE */}
      <div className="hotel-image">
        <img
          src={hotel.image}
          alt={hotel.name}
        />

        {/* FAVOURITE HEART */}
        <button
          type="button"
          className={`favourite-btn ${favourite ? "active" : ""}`}
          onClick={() => toggleFavourite(hotel)}
        >
          {favourite ? "♥" : "♡"}
        </button>
      </div>

      {/* HOTEL DETAILS */}
      <div className="hotel-info">

        <h3>{hotel.name}</h3>

        <p className="hotel-location">
          📍 {hotel.location}
        </p>

        <div className="hotel-price">
          ₹{hotel.price}
          <span> / night</span>
        </div>

        {/* ACTION BUTTONS */}
        <div className="hotel-actions">

          <Link
            to={`/hotels/${hotel.id}`}
            className="view-btn"
          >
            View Details
          </Link>

          <Link
            to={`/book/${hotel.id}`}
            className="book-btn"
          >
            Book Now
          </Link>

        </div>
      </div>

    </div>
  );
}

export default HotelCard;
