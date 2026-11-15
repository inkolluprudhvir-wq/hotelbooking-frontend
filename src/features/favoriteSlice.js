
import { createSlice } from "@reduxjs/toolkit";

const initialState =
  JSON.parse(
    localStorage.getItem("favorites")
  ) || [];

const favoriteSlice = createSlice({
  name: "favorites",
  initialState,

  reducers: {

    addFavorite: (state, action) => {
      const exists = state.find(
        item => String(item.id) === String(action.payload.id)
      );

      if (!exists) {
        state.push(action.payload);
      }

      localStorage.setItem(
        "favorites",
        JSON.stringify(state)
      );
    },

    removeFavorite: (state, action) => {
      const updatedFavorites = state.filter(
        item => String(item.id) !== String(action.payload)
      );

      localStorage.setItem(
        "favorites",
        JSON.stringify(updatedFavorites)
      );

      return updatedFavorites;
    }

  }
});

export const {
  addFavorite,
  removeFavorite
} = favoriteSlice.actions;

export default favoriteSlice.reducer;

