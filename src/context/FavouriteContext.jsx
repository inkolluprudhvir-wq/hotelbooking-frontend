
import { createContext, useContext, useState } from "react";

const FavouriteContext = createContext();

export function FavouriteProvider({ children }) {

  const [favourites, setFavourites] = useState(() => {
    try {
      const saved = JSON.parse(
        localStorage.getItem("favourites")
      );

      return Array.isArray(saved)
        ? saved.filter(item => item && item.id !== undefined)
        : [];
    } catch {
      return [];
    }
  });

  function toggleFavourite(hotel) {

    if (!hotel || hotel.id === undefined) return;

    const exists = favourites.some(
      item => item && item.id === hotel.id
    );

    const updated = exists
      ? favourites.filter(
          item => item && item.id !== hotel.id
        )
      : [...favourites, hotel];

    setFavourites(updated);

    localStorage.setItem(
      "favourites",
      JSON.stringify(updated)
    );
  }

  function isFavourite(id) {
    return favourites.some(
      item => item && item.id === id
    );
  }

  return (
    <FavouriteContext.Provider
      value={{
        favourites,
        toggleFavourite,
        isFavourite
      }}
    >
      {children}
    </FavouriteContext.Provider>
  );
}

export function useFavourites() {
  return useContext(FavouriteContext);
}
