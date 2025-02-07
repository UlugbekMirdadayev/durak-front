import { createSlice } from "@reduxjs/toolkit";

const initialState = JSON.parse(localStorage.getItem("user") || "{}") || {};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUser: (_, { payload }) => {
      localStorage.setItem("user", JSON.stringify(payload));
      localStorage.setItem("token", payload.token);
      return payload;
    },
  },
});

export const { setUser } = userSlice.actions;

export default userSlice.reducer;
