import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  visible: false,
  game: JSON.parse(localStorage.getItem("game")) || {},
};

const exitSlice = createSlice({
  name: "exit",
  initialState,
  reducers: {
    setExitVisible: (state, { payload }) => {
      state.visible = payload;
    },
    setGame: (state, { payload }) => {
      localStorage.setItem("game", JSON.stringify(payload));
      state.game = payload;
    },
    setBitaCount: (state, { payload }) => {
      state.game.beaten_cards_count = payload;
    },
  },
});

export const { setExitVisible, setGame, setBitaCount } = exitSlice.actions;

export default exitSlice.reducer;
