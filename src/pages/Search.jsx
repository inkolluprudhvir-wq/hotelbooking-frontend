
import { useEffect, useState } from "react";
import api from "../services/api";
import HotelCard from "../components/HotelCard";
import SearchBar from "../components/SearchBar";

function Search() {
  const [hotels, setHotels] = useState([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    async function fetchHotels() {
      try {
        const response = await api.get("/hotels");
        setHotels(response.data);
      } catch (error) {
        console.log(error);
      }
    }

    fetchHotels();
  }, []);

  const filteredHotels = hotels.filter((hotel) =>
    `${hotel.name} ${hotel.location}`
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  return (
    <div className="hotels-page">

      <div className="page-heading">
        <h1>Find Your Perfect Stay</h1>
        <p>Search hotels by name or location</p>
      </div>

      <SearchBar
        search={search}
        setSearch={setSearch}
      />

      <div className="hotels-container">
        {filteredHotels.length > 0 ? (
          filteredHotels.map((hotel) => (
            <HotelCard
              key={hotel.id}
              hotel={hotel}
            />
          ))
        ) : (
          <h3>No matching hotels found</h3>
        )}
      </div>

    </div>
  );
}

export default Search;
