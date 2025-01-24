import { configureStore } from "@reduxjs/toolkit";
import beautyShopApi from "../services/api/beautyShopApi";

export const store = configureStore({
  reducer: {
    [beautyShopApi.reducerPath]: beautyShopApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(beautyShopApi.middleware),
});
