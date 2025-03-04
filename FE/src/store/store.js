import { configureStore } from "@reduxjs/toolkit";
import cartReducer from "./slices/cartSlice";
import wishlistReducer from "./slices/wishlistSlice";
import authReducer from "./slices/authSlice";
import beautyShopApi from "../services/api/beautyShopApi";

export const store = configureStore({
  reducer: {
    cart: cartReducer,
    wishlist: wishlistReducer,
    auth: authReducer,
    [beautyShopApi.reducerPath]: beautyShopApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(beautyShopApi.middleware),
});
