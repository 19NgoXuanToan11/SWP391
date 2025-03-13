import { createSlice } from "@reduxjs/toolkit";

const loadCartState = () => {
  try {
    // Lấy thông tin người dùng hiện tại từ localStorage
    const userStr = localStorage.getItem("auth_user");
    const currentUser = userStr ? JSON.parse(userStr) : null;
    const userId = currentUser ? currentUser.id : "guest";

    // Lấy tất cả giỏ hàng từ localStorage
    const allCarts = JSON.parse(localStorage.getItem("allCarts")) || {};

    // Trả về giỏ hàng của người dùng hiện tại hoặc giỏ hàng trống nếu chưa có
    return (
      allCarts[userId] || {
        items: [],
        total: 0,
        quantity: 0,
      }
    );
  } catch (err) {
    return {
      items: [],
      total: 0,
      quantity: 0,
    };
  }
};

const saveCartState = (state) => {
  try {
    // Lấy thông tin người dùng hiện tại từ localStorage
    const userStr = localStorage.getItem("auth_user");
    const currentUser = userStr ? JSON.parse(userStr) : null;
    const userId = currentUser ? currentUser.id : "guest";

    // Lấy tất cả giỏ hàng từ localStorage
    const allCarts = JSON.parse(localStorage.getItem("allCarts")) || {};

    // Cập nhật giỏ hàng của người dùng hiện tại
    allCarts[userId] = state;

    // Lưu lại tất cả giỏ hàng vào localStorage
    localStorage.setItem("allCarts", JSON.stringify(allCarts));
  } catch (err) {
    console.error("Could not save cart state:", err);
  }
};

const calculateCartTotal = (items) => {
  return items.reduce((total, item) => {
    const itemPrice = parseFloat(item.price) || 0;
    const itemQuantity = parseInt(item.quantity) || 0;
    return total + itemPrice * itemQuantity;
  }, 0);
};

const calculateCartQuantity = (items) => {
  return items.reduce((total, item) => {
    return total + (parseInt(item.quantity) || 0);
  }, 0);
};

const cartSlice = createSlice({
  name: "cart",
  initialState: loadCartState(),
  reducers: {
    addToCart: (state, action) => {
      const newItem = action.payload;
      const existingItem = state.items.find((item) => item.id === newItem.id);

      if (existingItem) {
        existingItem.quantity =
          parseInt(existingItem.quantity) + parseInt(newItem.quantity);
      } else {
        state.items.push({
          ...newItem,
          quantity: parseInt(newItem.quantity),
        });
      }

      state.total = calculateCartTotal(state.items);
      state.quantity = calculateCartQuantity(state.items);
      saveCartState(state);
    },

    removeFromCart: (state, action) => {
      state.items = state.items.filter((item) => item.id !== action.payload);
      state.total = calculateCartTotal(state.items);
      state.quantity = calculateCartQuantity(state.items);
      saveCartState(state);
    },

    updateQuantity: (state, action) => {
      const { id, quantity } = action.payload;
      const item = state.items.find((item) => item.id === id);
      if (item) {
        item.quantity = parseInt(quantity);
        state.total = calculateCartTotal(state.items);
        state.quantity = calculateCartQuantity(state.items);
      }
      saveCartState(state);
    },

    clearCart: (state) => {
      state.items = [];
      state.total = 0;
      state.quantity = 0;
      saveCartState(state);
    },
  },
});

export const { addToCart, removeFromCart, updateQuantity, clearCart } =
  cartSlice.actions;

// Selectors
export const selectCartItems = (state) => state.cart.items;
export const selectCartTotal = (state) => state.cart.total;
export const selectCartQuantity = (state) => state.cart.quantity;

export default cartSlice.reducer;
