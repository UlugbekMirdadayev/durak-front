import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  visible: false,
  params: JSON.parse(localStorage.getItem("settings-params")) || {
    musics: 50,
    effects: 75,
  },
};

const settingsSlice = createSlice({
  name: "settings",
  initialState,
  reducers: {
    setSettingVisible: (_, { payload }) => {
      _.visible = payload;
    },
    setSettingParams: (_, { payload }) => {
      localStorage.setItem("settings-params", JSON.stringify(payload));
      _.params = payload;
    },
  },
});

export const { setSettingVisible, setSettingParams } = settingsSlice.actions;

export default settingsSlice.reducer;
