import { createSlice } from "@reduxjs/toolkit";

const loadAuthState = () => {
  try {
    const token = localStorage.getItem("token");
    const userInfo = localStorage.getItem("userInfo");
    if (token && userInfo) {
      return {
        user: JSON.parse(userInfo),
        token: token,
      };
    }
  } catch (err) {
    console.error("Error loading auth state:", err);
  }
  return {
    user: null,
    token: null,
  };
};

const initialState = loadAuthState();

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setCredentials: (state, action) => {
      const { user, token } = action.payload;
      state.user = user;
      state.token = token;
      // Lưu vào localStorage
      localStorage.setItem("token", token);
      localStorage.setItem("userInfo", JSON.stringify(user));
    },
    logout: (state) => {
      state.user = null;
      state.token = null;
      // Xóa khỏi localStorage
      localStorage.removeItem("token");
      localStorage.removeItem("userInfo");
    },
  },
});

export const { setCredentials, logout } = authSlice.actions;
export default authSlice.reducer;
