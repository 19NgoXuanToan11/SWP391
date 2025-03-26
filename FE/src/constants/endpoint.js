const endpoints = {
  // Auth
  LOGIN: "/Auth/login",
  REGISTER: "/Auth/register",
  GET_USER: "/Auth/users",
  LOGOUT: "/Auth/logout",
  REFRESH_TOKEN: "/Auth/refresh-token",
  VERIFY_EMAIL: "/Auth/verify-email",
  FORGOT_PASSWORD: "/Auth/forgot-password",
  RESET_PASSWORD: "/Auth/reset-password",

  // User
  GET_PROFILE: "/user/profile",
  UPDATE_PROFILE: "/user/profile",
  CHANGE_PASSWORD: "/user/change-password",

  // Products
  GET_PRODUCTS: "/Product",
  GET_PRODUCT_DETAIL: "/Product/:id",
  CREATE_PRODUCT: "/Product",
  UPDATE_PRODUCT: "/Product/:id",
  DELETE_PRODUCT: "/Product/:id",

  // Categories
  GET_CATEGORIES: "/Category",
  CREATE_CATEGORY: "/Category",
  UPDATE_CATEGORY: "/Category/:id",
  DELETE_CATEGORY: "/Category/:id",

  // Orders
  GET_ORDERS: "/orders",
  CREATE_ORDER: "/orders",
  UPDATE_ORDER_STATUS: "/orders/:id/status",

  // Reviews
  GET_PRODUCT_REVIEWS: "/products/:id/reviews",
  CREATE_REVIEW: "/reviews",

  // Dashboard
  GET_DASHBOARD_STATS: "/dashboard/stats",

  // Brands
  GET_BRANDS: "/Brand",
  CREATE_BRAND: "/Brand",
  UPDATE_BRAND: "/Brand/:id",
  DELETE_BRAND: "/Brand/:id",
};

export default endpoints;
