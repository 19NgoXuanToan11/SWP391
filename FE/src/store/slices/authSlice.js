import { createSlice } from "@reduxjs/toolkit";
import { clearCart } from "./cartSlice";
import { clearWishlist } from "./wishlistSlice";

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

// Hàm để chuyển giỏ hàng từ guest sang user khi đăng nhập
const transferGuestCartToUser = (userId) => {
  try {
    // Lấy tất cả giỏ hàng
    const allCarts = JSON.parse(localStorage.getItem("allCarts")) || {};

    // Nếu có giỏ hàng guest và user chưa có giỏ hàng
    if (
      allCarts["guest"] &&
      allCarts["guest"].items.length > 0 &&
      !allCarts[userId]
    ) {
      // Chuyển giỏ hàng guest cho user
      allCarts[userId] = allCarts["guest"];
      // Xóa giỏ hàng guest
      allCarts["guest"] = { items: [], total: 0, quantity: 0 };
      // Lưu lại
      localStorage.setItem("allCarts", JSON.stringify(allCarts));
    }
  } catch (error) {
    console.error("Error transferring guest cart to user:", error);
  }
};

// Hàm để chuyển danh sách yêu thích từ guest sang user khi đăng nhập
const transferGuestWishlistToUser = (userId) => {
  try {
    // Lấy tất cả danh sách yêu thích
    const allWishlists = JSON.parse(localStorage.getItem("allWishlists")) || {};

    // Nếu có danh sách yêu thích guest và user chưa có danh sách yêu thích
    if (
      allWishlists["guest"] &&
      allWishlists["guest"].items.length > 0 &&
      !allWishlists[userId]
    ) {
      // Chuyển danh sách yêu thích guest cho user
      allWishlists[userId] = allWishlists["guest"];
      // Xóa danh sách yêu thích guest
      allWishlists["guest"] = { items: [], total: 0 };
      // Lưu lại
      localStorage.setItem("allWishlists", JSON.stringify(allWishlists));
    }
  } catch (error) {
    console.error("Error transferring guest wishlist to user:", error);
  }
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

      // Chuyển giỏ hàng và danh sách yêu thích từ guest sang user
      transferGuestCartToUser(user.id);
      transferGuestWishlistToUser(user.id);
    },
    logout: (state, action) => {
      // Lưu username trước khi xóa state
      const username = state.user?.username;

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

      // Xóa giỏ hàng và danh sách yêu thích trong localStorage
      localStorage.removeItem("allCarts");
      localStorage.removeItem("allWishlists");

      // Không xóa avatar để duy trì giữa các phiên đăng nhập của cùng một user
      // Nhưng không giữ lại giữa các user khác nhau
      // if (username) {
      //   localStorage.removeItem(`userAvatar_${username}`);
      // }

      // Dispatch action để xóa giỏ hàng và danh sách yêu thích trong Redux store
      if (action.payload && action.payload.dispatch) {
        action.payload.dispatch(clearCart());
        action.payload.dispatch(clearWishlist());
      }
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
    // Thêm reducer mới để cập nhật thủ công state
    manualUpdate: (state, action) => {
      return { ...state, ...action.payload };
    },
  },
});

export const {
  setCredentials,
  logout,
  restoreAuth,
  checkSession,
  manualUpdate,
} = authSlice.actions;

export const selectAuth = (state) => state.auth;
export const selectCurrentUser = (state) => state.auth.user;
export const selectIsAuthenticated = (state) => state.auth.isAuthenticated;
export const selectIsAdmin = (state) => state.auth.isAdmin;

export default authSlice.reducer;
