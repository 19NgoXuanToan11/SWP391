import { createApi } from "@reduxjs/toolkit/query/react";
import { axiosBaseQuery } from "./api.service";
import endpoints from "../../constants/endpoint";

const beautyShopApi = createApi({
  reducerPath: "beautyShopApi",
  baseQuery: axiosBaseQuery(),
  tagTypes: ["Products", "Categories", "Orders", "User"],
  endpoints: (builder) => ({
    // Auth endpoints
    login: builder.mutation({
      query: (credentials) => ({
        url: endpoints.LOGIN,
        method: "POST",
        data: credentials,
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
      query: (userData) => ({
        url: endpoints.REGISTER,
        method: "POST",
        data: {
          email: userData.email,
          password: userData.password,
          // API reqres.in chỉ chấp nhận email và password
        },
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

    getProductDetail: builder.query({
      query: (id) => ({
        url: endpoints.GET_PRODUCT_DETAIL.replace(":id", id),
        method: "GET",
      }),
      providesTags: (result, error, id) => [{ type: "Products", id }],
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
  useGetProductsQuery,
  useGetProductDetailQuery,
  useCreateProductMutation,
  useGetCategoriesQuery,
  useGetOrdersQuery,
  useCreateOrderMutation,
  useGetUserProfileQuery,
  useUpdateUserProfileMutation,
} = beautyShopApi;

export default beautyShopApi;
