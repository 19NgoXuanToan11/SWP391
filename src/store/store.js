import { configureStore } from "@reduxjs/toolkit";
import beautyShopApi from "../services/api/beautyShopApi";
import authReducer from "./slices/authSlice";

export const store = configureStore({
  reducer: {
    [beautyShopApi.reducerPath]: beautyShopApi.reducer,
    auth: authReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(beautyShopApi.middleware),
});
