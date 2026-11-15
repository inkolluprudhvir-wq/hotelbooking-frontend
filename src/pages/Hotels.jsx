
import { useEffect, useState } from "react";
import api from "../services/api";
import HotelCard from "../components/HotelCard";
import SearchBar from "../components/SearchBar";
import "./Hotels.css";

function Hotels() {
  const [hotels, setHotels] = useState([]);
  const [search, setSearch] = useState("");
  const [budget, setBudget] = useState("");
  const [rating, setRating] = useState("");
  const [location, setLocation] = useState("");
  const [hotelType, setHotelType] = useState("");
  const [sort, setSort] = useState("");

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchHotels();
  }, []);

  async function fetchHotels() {
    try {
      const response = await api.get("/hotels");
      setHotels(response.data);
    } catch (error) {
      setError("Unable to load hotels");
    } finally {
      setLoading(false);
    }
  }

  // Get hotel price
  function getPrice(hotel) {
    const value =
      hotel.price ??
      hotel.pricePerNight ??
      hotel.rent ??
      hotel.amount;

    if (value === undefined || value === null || value === "") {
      return null;
    }

    const price = Number(
      String(value).replace(/[^\d.]/g, "")
    );

    return Number.isFinite(price) ? price : null;
  }

  // Get hotel rating
  function getRating(hotel) {
    return Number(hotel.rating ?? hotel.stars ?? 0);
  }

  // Get hotel location
  function getLocation(hotel) {
    return String(
      hotel.location ?? hotel.city ?? ""
    );
  }

  // Get hotel type
  function getType(hotel) {
    return String(
      hotel.type ??
      hotel.hotelType ??
      hotel.category ??
      ""
    ).toLowerCase();
  }

  // Unique locations from API
  const locations = [
    ...new Set(
      hotels
        .map((hotel) => getLocation(hotel))
        .filter(Boolean)
    )
  ];

  // Apply all filters
  let filteredHotels = hotels.filter((hotel) => {
    const hotelName = String(hotel.name ?? "").toLowerCase();
    const hotelLocation = getLocation(hotel).toLowerCase();

    const searchMatch =
      hotelName.includes(search.toLowerCase()) ||
      hotelLocation.includes(search.toLowerCase());

    const price = getPrice(hotel);
    let budgetMatch = true;

    if (budget === "low") {
      budgetMatch = price !== null && price < 2000;
    } else if (budget === "medium") {
      budgetMatch = price !== null && price >= 2000 && price <= 5000;
    } else if (budget === "high") {
      budgetMatch = price !== null && price > 5000 && price <= 10000;
    } else if (budget === "premium") {
      budgetMatch = price !== null && price > 10000;
    }

    const hotelRating = getRating(hotel);

    let ratingMatch = true;

    if (rating === "5") {
      ratingMatch = hotelRating >= 5;
    } else if (rating === "4") {
      ratingMatch = hotelRating >= 4;
    } else if (rating === "3") {
      ratingMatch = hotelRating >= 3;
    }

    const locationMatch =
      !location ||
      getLocation(hotel).toLowerCase() === location.toLowerCase();

    const type = getType(hotel);

    const typeMatch =
      !hotelType ||
      type.includes(hotelType);

    return (
      searchMatch &&
      budgetMatch &&
      ratingMatch &&
      locationMatch &&
      typeMatch
    );
  });

  // Price sorting
  if (sort === "low") {
    filteredHotels.sort(
      (a, b) => (getPrice(a) ?? Infinity) - (getPrice(b) ?? Infinity)
    );
  } else if (sort === "high") {
    filteredHotels.sort(
      (a, b) => (getPrice(b) ?? -Infinity) - (getPrice(a) ?? -Infinity)
    );
  }

  // Clear all filters
  function clearFilters() {
    setSearch("");
    setBudget("");
    setRating("");
    setLocation("");
    setHotelType("");
    setSort("");
  }

  if (loading) {
    return <h2 className="hotels-loading">Loading hotels...</h2>;
  }

  return (
    <div className="hotels-page">

      <div className="page-heading">
        <h1>Explore Hotels</h1>
        <p>Find the perfect stay for your next journey.</p>
      </div>

      {/* Search */}
      <div className="hotel-search">
        <SearchBar
          search={search}
          setSearch={setSearch}
        />
      </div>

      {/* Filters */}
      <div className="hotel-filters">

        <select
          value={budget}
          onChange={(e) => setBudget(e.target.value)}
        >
          <option value="">All Budgets</option>
          <option value="low">Under ₹2,000</option>
          <option value="medium">₹2,000 - ₹5,000</option>
          <option value="high">₹5,000 - ₹10,000</option>
          <option value="premium">Above ₹10,000</option>
        </select>

        <select
          value={rating}
          onChange={(e) => setRating(e.target.value)}
        >
          <option value="">All Ratings</option>
          <option value="5">5 Stars</option>
          <option value="4">4 Stars & Above</option>
          <option value="3">3 Stars & Above</option>
        </select>

        <select
          value={location}
          onChange={(e) => setLocation(e.target.value)}
        >
          <option value="">All Locations</option>

          {locations.map((place) => (
            <option key={place} value={place}>
              {place}
            </option>
          ))}
        </select>

        <select
          value={hotelType}
          onChange={(e) => setHotelType(e.target.value)}
        >
          <option value="">All Hotel Types</option>
          <option value="resort">Resort</option>
          <option value="luxury">Luxury</option>
          <option value="budget">Budget</option>
          <option value="beach">Beach Hotel</option>
        </select>

        <select
          value={sort}
          onChange={(e) => setSort(e.target.value)}
        >
          <option value="">Sort By Price</option>
          <option value="low">Price: Low to High</option>
          <option value="high">Price: High to Low</option>
        </select>

        <button
          className="clear-filters-btn"
          onClick={clearFilters}
        >
          Clear Filters
        </button>

      </div>

      {error && <p className="hotel-error">{error}</p>}

      <div className="hotel-results">
        <p>
          Showing <strong>{filteredHotels.length}</strong> hotels
        </p>
      </div>

      {/* Hotel Cards */}
      <div className="hotels-container">

        {filteredHotels.length > 0 ? (
          filteredHotels.map((hotel) => (
            <HotelCard
              key={hotel.id}
              hotel={hotel}
            />
          ))
        ) : (
          <div className="no-hotels">
            <h3>No hotels found!</h3>
            <p>Try changing your search or filters.</p>
            <button onClick={clearFilters}>
              Reset Filters
            </button>
          </div>
        )}

      </div>

    </div>
  );
}

export default Hotels;
