import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  opened: false,
  avatarModal: false,
  shareModal: false,
  giveUpModal: false,
  paymentModal: false,
  profile: {},
};

const profileSlice = createSlice({
  name: "profile",
  initialState,
  reducers: {
    setProfileOpened: (state, { payload }) => {
      state.opened = payload;
    },
    setGiveUpModal: (state, { payload }) => {
      state.giveUpModal = payload;
    },
    setShareModal: (state, { payload }) => {
      state.shareModal = payload;
    },
    setAvatarModal: (state, { payload }) => {
      state.avatarModal = payload;
    },
    setPaymentModal: (state, { payload }) => {
      state.paymentModal = payload;
    },
    setProfile: (state, { payload }) => {
      state.profile = payload;
    },
  },
});

export const {
  setProfileOpened,
  setProfile,
  setAvatarModal,
  setShareModal,
  setGiveUpModal,
  setPaymentModal,
} = profileSlice.actions;

export default profileSlice.reducer;
