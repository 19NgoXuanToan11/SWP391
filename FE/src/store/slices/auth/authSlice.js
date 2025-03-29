import { createSlice } from "@reduxjs/toolkit";
import { clearCart } from "../cart/cartSlice";
import { clearWishlist } from "../wishlist/wishlistSlice";

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

      // Đảm bảo giỏ hàng và danh sách yêu thích của người dùng được tạo mới nếu chưa tồn tại
      const userId = user.id;

      // Xử lý giỏ hàng
      const allCarts = JSON.parse(localStorage.getItem("allCarts")) || {};
      if (!allCarts[userId]) {
        allCarts[userId] = { items: [], total: 0, quantity: 0 };
        localStorage.setItem("allCarts", JSON.stringify(allCarts));
      }

      // Xử lý danh sách yêu thích
      const allWishlists =
        JSON.parse(localStorage.getItem("allWishlists")) || {};
      if (!allWishlists[userId]) {
        allWishlists[userId] = { items: [], total: 0 };
        localStorage.setItem("allWishlists", JSON.stringify(allWishlists));
      }

      // Chuyển giỏ hàng và danh sách yêu thích từ guest sang user nếu cần
      transferGuestCartToUser(userId);
      transferGuestWishlistToUser(userId);
    },
    logout: (state, action) => {
      // Lưu username trước khi xóa state
      const username = state.user?.username;
      const userAvatar = username
        ? localStorage.getItem(`userAvatar_${username}`)
        : null;

      // Lưu lại allCarts và allWishlists
      const allCarts = localStorage.getItem("allCarts");
      const allWishlists = localStorage.getItem("allWishlists");

      // Reset state
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      state.isAdmin = false;
      state.sessionId = null;

      // Ghi nhận sự kiện đăng xuất
      const logoutEvent = new Date().getTime();
      localStorage.setItem("auth_logout_event", logoutEvent);

      // Xóa các thông tin xác thực người dùng
      localStorage.removeItem("auth_token");
      localStorage.removeItem("auth_user");
      localStorage.removeItem("auth_sessionId");
      localStorage.removeItem("auth_isAdmin");
      localStorage.removeItem("isAdmin");
      localStorage.removeItem("token");
      localStorage.removeItem("auth_mode");

      // Khôi phục dữ liệu giỏ hàng và danh sách yêu thích
      if (allCarts) localStorage.setItem("allCarts", allCarts);
      if (allWishlists) localStorage.setItem("allWishlists", allWishlists);

      // Khôi phục avatar nếu có
      if (username && userAvatar) {
        localStorage.setItem(`userAvatar_${username}`, userAvatar);
      }

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
