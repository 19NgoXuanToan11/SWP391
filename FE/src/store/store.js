import { configureStore } from "@reduxjs/toolkit";
<<<<<<< Updated upstream
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
=======
import beautyShopApi from "../services/api/beautyShopApi";
import authReducer from "./slices/authSlice";

export const store = configureStore({
  reducer: {
    [beautyShopApi.reducerPath]: beautyShopApi.reducer,
    auth: authReducer,
>>>>>>> Stashed changes
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(beautyShopApi.middleware),
});
