import { createSlice } from "@reduxjs/toolkit";
import authReducer from "./authSlice"; // Import reducer đã tạo

// Hàm lấy dữ liệu an toàn từ localStorage hoặc sessionStorage
const getFromStorage = (key) => {
  try {
    return localStorage.getItem(key) || sessionStorage.getItem(key) || null;
  } catch (error) {
    console.error(`Lỗi khi lấy ${key} từ storage:`, error);
    return null;
  }
};

// Lấy user từ storage
const getUserFromStorage = () => {
  try {
    const userInfo = localStorage.getItem("userInfo");
    return userInfo ? JSON.parse(userInfo) : null;
  } catch (error) {
    console.error("Error parsing user info:", error);
    localStorage.removeItem("userInfo"); // Xóa data không hợp lệ
    return null;
  }
};

const getTokenFromStorage = () => {
  try {
    return localStorage.getItem("token") || null;
  } catch (error) {
    console.error("Error getting token:", error);
    localStorage.removeItem("token"); // Xóa token không hợp lệ
    return null;
  }
};

const initialState = {
  user: getUserFromStorage(),
  token: getTokenFromStorage(),
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setCredentials: (state, action) => {
      const { user, token } = action.payload;
      if (!user || !token) {
        console.error("Invalid credentials data:", action.payload);
        return;
      }
      state.user = user;
      state.token = token;
      try {
        localStorage.setItem("token", token);
        localStorage.setItem("userInfo", JSON.stringify(user));
      } catch (error) {
        console.error("Error saving credentials:", error);
      }
    },
    logout: (state) => {
      state.user = null;
      state.token = null;
      try {
        localStorage.removeItem("token");
        localStorage.removeItem("userInfo");
      } catch (error) {
        console.error("Error during logout:", error);
      }
    },
  },
});

export const { setCredentials, logout } = authSlice.actions;
export default authSlice.reducer;

export const selectAuth = (state) => ({
  isAuthenticated: !!state.auth.token,
  user: state.auth.user,
  token: state.auth.token,
});
