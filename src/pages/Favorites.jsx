
import { useState } from "react";
import { useFavourites } from "../context/FavouriteContext";
import HotelCard from "../components/HotelCard";
import SearchBar from "../components/SearchBar";

function Favourites() {
  const { favourites } = useFavourites();
  const [search, setSearch] = useState("");

  const filteredFavourites = favourites.filter((hotel) =>
    `${hotel.name} ${hotel.location}`
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  return (
    <div className="hotels-page">
      <div className="page-heading">
        <h1>My Favourite Hotels ♥</h1>
        <p>Your saved hotels in one place</p>
      </div>

      <SearchBar search={search} setSearch={setSearch} />

      <div className="hotels-container">
        {filteredFavourites.length > 0 ? (
          filteredFavourites.map((hotel) => (
            <HotelCard key={hotel.id} hotel={hotel} />
          ))
        ) : (
          <div className="empty-favourites">
            <h2>♡</h2>
            <h3>No Favourite Hotels Found</h3>
            <p>Add hotels to your favourites.</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default Favourites;
