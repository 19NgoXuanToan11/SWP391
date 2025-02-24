import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { axiosBaseQuery } from "./api.service";
import endpoints from "../../constants/endpoint";

const beautyShopApi = createApi({
  reducerPath: "beautyShopApi",
  baseQuery: fetchBaseQuery({
    baseUrl: "https://localhost:7285/api",
    prepareHeaders: (headers) => {
      headers.set("Content-Type", "application/json");
      headers.set("Access-Control-Allow-Origin", "*");
      return headers;
    },
    credentials: "include",
  }),
  tagTypes: ["Products", "Categories", "Orders", "User"],
  endpoints: (builder) => ({
    // Auth endpoints
    login: builder.mutation({
      query: (credentials) => ({
        url: endpoints.LOGIN,
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: credentials,
      }),
      // Xử lý response để lưu token
      onQueryStarted: async (_, { queryFulfilled }) => {
        try {
          const { data } = await queryFulfilled;
          localStorage.setItem("token", data.token);
        } catch (err) {
          // Handle error
        }
      },
    }),

    register: builder.mutation({
      query: (data) => ({
        url: endpoints.REGISTER,
        method: "POST",
        body: data,
      }),
    }),

    verifyEmail: builder.mutation({
      query: (data) => ({
        url: endpoints.VERIFY_EMAIL,
        method: "GET",
        body: data,
      }),
    }),

    // Product endpoints
    getProducts: builder.query({
      query: (params) => ({
        url: endpoints.GET_PRODUCTS,
        method: "GET",
        params,
      }),
      providesTags: ["Products"],
    }),

    getProductById: builder.query({
      query: (id) => `/Product/${id}`,
      transformResponse: (response) => {
        console.log("API Response:", response);
        return response;
      },
      transformErrorResponse: (error) => {
        console.error("API Error:", error);
        return error;
      },
    }),

    createProduct: builder.mutation({
      query: (productData) => ({
        url: endpoints.CREATE_PRODUCT,
        method: "POST",
        data: productData,
      }),
      invalidatesTags: ["Products"],
    }),

    // Category endpoints
    getCategories: builder.query({
      query: () => ({
        url: endpoints.GET_CATEGORIES,
        method: "GET",
      }),
      providesTags: ["Categories"],
    }),

    // Order endpoints
    getOrders: builder.query({
      query: (params) => ({
        url: endpoints.GET_ORDERS,
        method: "GET",
        params,
      }),
      providesTags: ["Orders"],
    }),

    createOrder: builder.mutation({
      query: (orderData) => ({
        url: endpoints.CREATE_ORDER,
        method: "POST",
        data: orderData,
      }),
      invalidatesTags: ["Orders"],
    }),

    // User profile
    getUserProfile: builder.query({
      query: () => ({
        url: endpoints.GET_PROFILE,
        method: "GET",
      }),
      providesTags: ["User"],
    }),

    updateUserProfile: builder.mutation({
      query: (userData) => ({
        url: endpoints.UPDATE_PROFILE,
        method: "PUT",
        data: userData,
      }),
      invalidatesTags: ["User"],
    }),
  }),
});

export const {
  useLoginMutation,
  useRegisterMutation,
  useVerifyEmailMutation,
  useGetProductsQuery,
  useGetProductByIdQuery,
  useCreateProductMutation,
  useGetCategoriesQuery,
  useGetOrdersQuery,
  useCreateOrderMutation,
  useGetUserProfileQuery,
  useUpdateUserProfileMutation,
} = beautyShopApi;

export default beautyShopApi;
