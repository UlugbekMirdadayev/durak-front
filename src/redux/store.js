import { configureStore } from "@reduxjs/toolkit";
import user from "./userSlice";
import exitgame from "./exitSlice";
import profile from "./profileSlice";
import settings from "./settingsSlice";
import logout from "./logoutSlice";
import products from "./productsSlice";

const store = configureStore({
  reducer: {
    user,
    exitgame,
    profile,
    settings,
    logout,
    products
  },
  // eslint-disable-next-line no-undef
  devTools: process.env.NODE_ENV !== "production",
});

export default store;
