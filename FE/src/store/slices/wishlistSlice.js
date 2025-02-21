import { createSlice } from "@reduxjs/toolkit";

// Hàm load state từ localStorage
const loadWishlistState = () => {
  try {
    const wishlistState = localStorage.getItem("wishlistState");
    return wishlistState
      ? JSON.parse(wishlistState)
      : {
          items: [],
          total: 0,
        };
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
    localStorage.setItem("wishlistState", JSON.stringify(state));
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
