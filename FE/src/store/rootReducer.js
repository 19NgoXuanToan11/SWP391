import { configureStore, combineReducers } from "@reduxjs/toolkit";
import persistStore from "redux-persist/es/persistStore";
import persistReducer from "redux-persist/es/persistReducer";
import storage from "redux-persist/lib/storage"; // defaults to localStorage for web
import { setupListeners } from "@reduxjs/toolkit/query";

// Import các reducers
import authReducer from "./slices/auth/authSlice";
import cartReducer from "./slices/cart/cartSlice";
import wishlistReducer from "./slices/wishlist/wishlistSlice";

// Import API service
import beautyShopApi from "../services/api/beautyShopApi";

// Cấu hình persist
const persistConfig = {
  key: "root",
  storage,
  whitelist: ["auth", "cart", "wishlist"], // Chỉ persist các state này
  blacklist: ["beautyShopApi"], // KHÔNG persist RTK Query cache
};

// Combine tất cả reducers
const rootReducer = combineReducers({
  auth: authReducer,
  cart: cartReducer,
  wishlist: wishlistReducer,
  [beautyShopApi.reducerPath]: beautyShopApi.reducer, // Thêm reducer của RTK Query
});

// Tạo persisted reducer
const persistedReducer = persistReducer(persistConfig, rootReducer);

// Cấu hình store
export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [
          "persist/PERSIST",
          "persist/REHYDRATE",
          "persist/REGISTER",
        ],
      },
    }).concat(beautyShopApi.middleware), // Quan trọng: Thêm middleware của RTK Query
  devTools: process.env.NODE_ENV !== "production",
});

// Cấu hình listeners cho RTK Query
setupListeners(store.dispatch);

// Tạo persistor
export const persistor = persistStore(store);
