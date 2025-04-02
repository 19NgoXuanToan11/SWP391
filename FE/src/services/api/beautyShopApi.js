import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
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
  tagTypes: ["Products", "Categories", "Orders", "User", "Brands"],
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
        params: { token: data }, // Sử dụng 'data' ở đây, vì 'data' sẽ chứa token
      }),
    }),

    // Product endpoints
    getProducts: builder.query({
      query: () => endpoints.GET_PRODUCTS,
      providesTags: ["Products"],
    }),

    getProductById: builder.query({
      query: (id) => endpoints.GET_PRODUCT_DETAIL.replace(":id", id),
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
        body: {
          productName: productData.productName,
          description: productData.description,
          price: productData.price,
          stock: productData.stock,
          mainIngredients: productData.mainIngredients,
          brandId: productData.brandId,
          volumeId: productData.volumeId,
          skinTypeId: productData.skinTypeId,
          categoryId: productData.categoryId,
          imageUrls: productData.imageUrls,
        },
      }),
      invalidatesTags: ["Products"],
    }),

    updateProduct: builder.mutation({
      query: ({ id, productData }) => ({
        url: endpoints.UPDATE_PRODUCT.replace(":id", id),
        method: "PUT",
        body: productData,
      }),
      invalidatesTags: ["Products"],
    }),

    deleteProduct: builder.mutation({
      query: (id) => ({
        url: endpoints.DELETE_PRODUCT.replace(":id", id),
        method: "DELETE",
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
      transformResponse: (response) => {
        console.log("Categories API Response:", response);
        return response;
      },
      transformErrorResponse: (error) => {
        console.error("Categories API Error:", error);
        return error;
      },
    }),

    createCategory: builder.mutation({
      query: (categoryData) => ({
        url: endpoints.CREATE_CATEGORY,
        method: "POST",
        body: categoryData,
      }),
      invalidatesTags: ["Categories"],
    }),

    updateCategory: builder.mutation({
      query: ({ id, categoryData }) => ({
        url: endpoints.UPDATE_CATEGORY.replace(":id", id),
        method: "PUT",
        body: categoryData,
      }),
      invalidatesTags: ["Categories"],
    }),

    deleteCategory: builder.mutation({
      query: (id) => ({
        url: endpoints.DELETE_CATEGORY.replace(":id", id),
        method: "DELETE",
      }),
      invalidatesTags: ["Categories"],
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
        body: orderData,
      }),
      invalidatesTags: ["Orders", "Products"],
    }),

    cancelOrder: builder.mutation({
      query: (orderId) => ({
        url: `Order/${orderId}/cancel`,
        method: "POST",
      }),
      invalidatesTags: ["Orders", "Products"],
    }),

    updateOrderStatus: builder.mutation({
      query: ({ orderId, status }) => ({
        url: `Order/${orderId}/status`,
        method: "PATCH",
        body: { status },
      }),
      invalidatesTags: ["Orders", "Products"],
    }),

    updateUserProfile: builder.mutation({
      query: (userData) => ({
        url: endpoints.UPDATE_PROFILE,
        method: "PUT",
        data: userData,
      }),
      invalidatesTags: ["User"],
    }),

    // Brand endpoints
    getBrands: builder.query({
      query: () => ({
        url: endpoints.GET_BRANDS,
        method: "GET",
      }),
      providesTags: ["Brands"],
      transformResponse: (response) => {
        console.log("Brands API Response:", response);
        return response;
      },
      transformErrorResponse: (error) => {
        console.error("Brands API Error:", error);
        return error;
      },
    }),

    createBrand: builder.mutation({
      query: (brandData) => ({
        url: endpoints.CREATE_BRAND,
        method: "POST",
        body: brandData,
      }),
      invalidatesTags: ["Brands"],
    }),

    updateBrand: builder.mutation({
      query: ({ id, brandData }) => ({
        url: endpoints.UPDATE_BRAND.replace(":id", id),
        method: "PUT",
        body: brandData,
      }),
      invalidatesTags: ["Brands"],
    }),

    deleteBrand: builder.mutation({
      query: (id) => ({
        url: endpoints.DELETE_BRAND.replace(":id", id),
        method: "DELETE",
      }),
      invalidatesTags: ["Brands"],
    }),

    // Forgot password endpoint
    forgotPassword: builder.mutation({
      query: (data) => ({
        url: endpoints.FORGOT_PASSWORD,
        method: "POST",
        body: data,
      }),
    }),

    // Reset password endpoint
    resetPassword: builder.mutation({
      query: (data) => ({
        url: endpoints.RESET_PASSWORD,
        method: "POST",
        body: data,
      }),
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
  useCreateCategoryMutation,
  useUpdateCategoryMutation,
  useDeleteCategoryMutation,
  useGetOrdersQuery,
  useCreateOrderMutation,
  useCancelOrderMutation,
  useUpdateOrderStatusMutation,
  useUpdateUserProfileMutation,
  useGetBrandsQuery,
  useCreateBrandMutation,
  useUpdateBrandMutation,
  useDeleteBrandMutation,
  useForgotPasswordMutation,
  useResetPasswordMutation,
  useUpdateProductMutation,
  useDeleteProductMutation,
} = beautyShopApi;

export default beautyShopApi;
