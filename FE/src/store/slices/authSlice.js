import { createSlice } from "@reduxjs/toolkit";
<<<<<<< Updated upstream
import authReducer from "./authSlice"; // Import reducer đã tạo
=======
>>>>>>> Stashed changes

const loadAuthState = () => {
  try {
    const token = localStorage.getItem("token");
    const userInfo = localStorage.getItem("userInfo");
<<<<<<< Updated upstream
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
=======
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
>>>>>>> Stashed changes

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setCredentials: (state, action) => {
      const { user, token } = action.payload;
<<<<<<< Updated upstream
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
=======
      state.user = user;
      state.token = token;
      // Lưu vào localStorage
      localStorage.setItem("token", token);
      localStorage.setItem("userInfo", JSON.stringify(user));
>>>>>>> Stashed changes
    },
    logout: (state) => {
      state.user = null;
      state.token = null;
<<<<<<< Updated upstream
      try {
        localStorage.removeItem("token");
        localStorage.removeItem("userInfo");
      } catch (error) {
        console.error("Error during logout:", error);
      }
=======
      // Xóa khỏi localStorage
      localStorage.removeItem("token");
      localStorage.removeItem("userInfo");
>>>>>>> Stashed changes
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
