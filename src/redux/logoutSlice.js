import { createSlice } from "@reduxjs/toolkit";

const initialState = false;

const logoutSlice = createSlice({
  name: "logout",
  initialState,
  reducers: {
    setLogoutVisible: (_, { payload }) => payload,
  },
});

export const { setLogoutVisible } = logoutSlice.actions;

export default logoutSlice.reducer;
