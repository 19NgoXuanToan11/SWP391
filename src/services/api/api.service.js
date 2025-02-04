import axios from "axios";

export const axiosBaseQuery =
  () =>
  async ({ url, method, data, params }) => {
    try {
      const baseURL = "https://reqres.in/api"; // URL API của bạn
      const headers = {
        "Content-Type": "application/json",
      };

      // Thêm token vào header nếu có
      const token = localStorage.getItem("token");
      if (token) {
        headers.Authorization = `Bearer ${token}`;
      }

      const result = await axios({
        url: baseURL + url,
        method,
        data,
        params,
        headers,
      });

      return { data: result.data };
    } catch (axiosError) {
      // Xử lý lỗi từ API reqres.in
      const errorResponse = {
        status: axiosError.response?.status,
        data: {
          error:
            axiosError.response?.data?.error ||
            "Đã có lỗi xảy ra. Vui lòng thử lại sau.",
        },
      };

      // Log lỗi để debug
      console.error("API Error:", errorResponse);

      return { error: errorResponse };
    }
  };
