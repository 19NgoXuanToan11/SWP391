import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  name: localStorage.getItem("userName") || "",
  email: localStorage.getItem("userEmail") || "",
  location: localStorage.getItem("userLocation") || "",
  bio: localStorage.getItem("userBio") || "",
  avatar: localStorage.getItem("userAvatar") || "",
};

const profileSlice = createSlice({
  name: "profile",
  initialState,
  reducers: {
    updateUserProfile: (state, action) => {
      const { name, email, location, bio, avatar } = action.payload;
      state.name = name;
      state.email = email;
      state.location = location;
      state.bio = bio;
      state.avatar = avatar;
    },
    clearProfile: (state) => {
      state.name = "";
      state.email = "";
      state.location = "";
      state.bio = "";
      state.avatar = "";
    },
  },
});

export const { updateUserProfile, clearProfile } = profileSlice.actions;
export default profileSlice.reducer;
