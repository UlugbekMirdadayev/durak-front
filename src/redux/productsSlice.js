import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  all: JSON.parse(localStorage.getItem("products") || "[]") || [],
  my: JSON.parse(localStorage.getItem("myProducts") || "[]") || [],
};

const productsSlice = createSlice({
  name: "products",
  initialState,
  reducers: {
    setProducts: (state, { payload }) => {
      localStorage.setItem("products", JSON.stringify(payload));
      return { ...state, all: payload };
    },
    setMyProducts: (state, { payload }) => {
      localStorage.setItem("myProducts", JSON.stringify(payload));
      return { ...state, my: payload };
    },
  },
});

export const { setProducts, setMyProducts } = productsSlice.actions;

export default productsSlice.reducer;
