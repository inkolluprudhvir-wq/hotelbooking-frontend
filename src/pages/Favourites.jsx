
import { useState } from "react";
import { useFavourites } from "../context/FavouriteContext";
import HotelCard from "../components/HotelCard";
import SearchBar from "../components/SearchBar";

function Favourites() {

  const { favourites } = useFavourites();

  const [search, setSearch] = useState("");

  // Filter valid favourite hotels
  const validFavourites = favourites.filter(
    (hotel) => hotel && hotel.id !== undefined
  );

  // Search functionality
  const filteredFavourites = validFavourites.filter((hotel) =>
    `${hotel.name || ""} ${hotel.location || ""}`
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  return (
    <div className="hotels-page">

      {/* PAGE HEADING */}
      <div className="page-heading">
        <h1>
          My Favourite Hotels{" "}
          <span style={{ color: "#ff69b4" }}>♥</span>
        </h1>

        <p>Your saved hotels in one place</p>
      </div>

      {/* SEARCH BAR */}
      <SearchBar
        search={search}
        setSearch={setSearch}
      />

      {/* FAVOURITE HOTELS */}
      <div className="hotels-container">

        {filteredFavourites.length > 0 ? (

          filteredFavourites.map((hotel) => (

            <HotelCard
              key={hotel.id}
              hotel={hotel}
            />

          ))

        ) : (

          <div className="empty-favourites">

            <h2
              style={{
                color: "#ffb6c1",
                fontSize: "55px"
              }}
            >
              ♡
            </h2>

            <h3>No Favourite Hotels Found</h3>

            <p>
              {search
                ? "No hotels match your search."
                : "Add hotels to your favourites."}
            </p>

          </div>

        )}

      </div>

    </div>
  );
}

export default Favourites;
