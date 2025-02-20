const endpoints = {
  // Auth
  LOGIN: "/login",
  REGISTER: "/register",
  GET_USER: "/users",
  LOGOUT: "/auth/logout",
  REFRESH_TOKEN: "/auth/refresh-token",

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
  GET_CATEGORIES: "/categories",
  CREATE_CATEGORY: "/categories",
  UPDATE_CATEGORY: "/categories/:id",
  DELETE_CATEGORY: "/categories/:id",

  // Orders
  GET_ORDERS: "/orders",
  CREATE_ORDER: "/orders",
  UPDATE_ORDER_STATUS: "/orders/:id/status",

  // Reviews
  GET_PRODUCT_REVIEWS: "/products/:id/reviews",
  CREATE_REVIEW: "/reviews",

  // Dashboard
  GET_DASHBOARD_STATS: "/dashboard/stats",
};

export default endpoints;
