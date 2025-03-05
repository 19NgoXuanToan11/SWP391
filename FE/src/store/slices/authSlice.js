import { createSlice } from "@reduxjs/toolkit";

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
  user: null,
  token: null,
  isAuthenticated: false,
  isAdmin: false,
  sessionId: null,
};

// Hàm helper để lấy thông tin từ localStorage
const getAuthFromLocalStorage = () => {
  try {
    const token = localStorage.getItem("auth_token");
    const userStr = localStorage.getItem("auth_user");
    const sessionId = localStorage.getItem("auth_sessionId");
    const isAdmin = localStorage.getItem("auth_isAdmin") === "true";

    if (token && userStr && sessionId) {
      const user = JSON.parse(userStr);
      return {
        user,
        token,
        isAuthenticated: true,
        isAdmin,
        sessionId,
      };
    }
  } catch (error) {
    console.error("Error reading auth from localStorage:", error);
  }
  return null;
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setCredentials: (state, action) => {
      const { user, token } = action.payload;
      const sessionId = Date.now().toString();

      state.user = user;
      state.token = token;
      state.isAuthenticated = true;
      state.isAdmin = user.role === "Admin";
      state.sessionId = sessionId;

      // Lưu thông tin vào localStorage
      localStorage.setItem("auth_token", token);
      localStorage.setItem("auth_user", JSON.stringify(user));
      localStorage.setItem("auth_sessionId", sessionId);
      localStorage.setItem("auth_isAdmin", (user.role === "Admin").toString());
    },
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      state.isAdmin = false;
      state.sessionId = null;

      // Xóa thông tin khỏi localStorage
      localStorage.removeItem("auth_token");
      localStorage.removeItem("auth_user");
      localStorage.removeItem("auth_sessionId");
      localStorage.removeItem("auth_isAdmin");
    },
    // Khôi phục trạng thái từ localStorage
    restoreAuth: (state) => {
      const authData = getAuthFromLocalStorage();
      if (authData) {
        state.user = authData.user;
        state.token = authData.token;
        state.isAuthenticated = authData.isAuthenticated;
        state.isAdmin = authData.isAdmin;
        state.sessionId = authData.sessionId;
      }
    },
    // Kiểm tra phiên đăng nhập
    checkSession: (state) => {
      const authData = getAuthFromLocalStorage();

      // Nếu không có thông tin đăng nhập trong localStorage
      if (!authData) {
        if (state.isAuthenticated) {
          // Nếu đang đăng nhập trong state nhưng không có trong localStorage, đăng xuất
          state.user = null;
          state.token = null;
          state.isAuthenticated = false;
          state.isAdmin = false;
          state.sessionId = null;
        }
        return;
      }

      // Nếu có thông tin đăng nhập trong localStorage, cập nhật state
      state.user = authData.user;
      state.token = authData.token;
      state.isAuthenticated = authData.isAuthenticated;
      state.isAdmin = authData.isAdmin;
      state.sessionId = authData.sessionId;
    },
  },
});

export const { setCredentials, logout, restoreAuth, checkSession } =
  authSlice.actions;

export const selectAuth = (state) => state.auth;
export const selectCurrentUser = (state) => state.auth.user;
export const selectIsAuthenticated = (state) => state.auth.isAuthenticated;
export const selectIsAdmin = (state) => state.auth.isAdmin;

export default authSlice.reducer;
