import { createSlice } from "@reduxjs/toolkit";

// Hàm load state từ localStorage
const loadWishlistState = () => {
  try {
    // Lấy thông tin người dùng hiện tại từ localStorage
    const userStr = localStorage.getItem("auth_user");
    const currentUser = userStr ? JSON.parse(userStr) : null;
    const userId = currentUser ? currentUser.id : "guest";

    // Lấy tất cả danh sách yêu thích từ localStorage
    const allWishlists = JSON.parse(localStorage.getItem("allWishlists")) || {};

    // Trả về danh sách yêu thích của người dùng hiện tại hoặc danh sách trống nếu chưa có
    return (
      allWishlists[userId] || {
        items: [],
        total: 0,
      }
    );
  } catch (err) {
    console.error("Error loading wishlist state:", err);
    return {
      items: [],
      total: 0,
    };
  }
};

// Hàm lưu state vào localStorage
const saveWishlistState = (state) => {
  try {
    // Lấy thông tin người dùng hiện tại từ localStorage
    const userStr = localStorage.getItem("auth_user");
    const currentUser = userStr ? JSON.parse(userStr) : null;
    const userId = currentUser ? currentUser.id : "guest";

    // Lấy tất cả danh sách yêu thích từ localStorage
    const allWishlists = JSON.parse(localStorage.getItem("allWishlists")) || {};

    // Cập nhật danh sách yêu thích của người dùng hiện tại
    allWishlists[userId] = state;

    // Lưu lại tất cả danh sách yêu thích vào localStorage
    localStorage.setItem("allWishlists", JSON.stringify(allWishlists));
  } catch (err) {
    console.error("Error saving wishlist state:", err);
  }
};

const wishlistSlice = createSlice({
  name: "wishlist",
  initialState: loadWishlistState(),
  reducers: {
    // Thêm sản phẩm vào wishlist
    addToWishlist: (state, action) => {
      const newItem = action.payload;
      const existingItem = state.items.find((item) => item.id === newItem.id);

      if (!existingItem) {
        state.items.push({
          id: newItem.id,
          name: newItem.name,
          price: newItem.price,
          image: newItem.image,
          brand: newItem.brand,
          description: newItem.description,
          stock: newItem.stock,
          discount: newItem.discount,
          originalPrice: newItem.originalPrice,
          rating: newItem.rating,
        });
        state.total = state.items.length;
        saveWishlistState(state);
      }
    },

    // Xóa sản phẩm khỏi wishlist
    removeFromWishlist: (state, action) => {
      state.items = state.items.filter((item) => item.id !== action.payload);
      state.total = state.items.length;
      saveWishlistState(state);
    },

    // Xóa toàn bộ wishlist
    clearWishlist: (state) => {
      state.items = [];
      state.total = 0;
      saveWishlistState(state);
    },

    // Kiểm tra sản phẩm có trong wishlist
    toggleWishlist: (state, action) => {
      const existingIndex = state.items.findIndex(
        (item) => item.id === action.payload.id
      );

      if (existingIndex >= 0) {
        state.items.splice(existingIndex, 1);
      } else {
        state.items.push(action.payload);
      }

      state.total = state.items.length;
      saveWishlistState(state);
    },
  },
});

// Export actions
export const {
  addToWishlist,
  removeFromWishlist,
  clearWishlist,
  toggleWishlist,
} = wishlistSlice.actions;

// Export selectors
export const selectWishlistItems = (state) => state.wishlist.items;
export const selectWishlistTotal = (state) => state.wishlist.total;
export const selectIsInWishlist = (state, productId) =>
  state.wishlist.items.some((item) => item.id === productId);

// Export reducer
export default wishlistSlice.reducer;
