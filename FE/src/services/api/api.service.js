import axios from "axios";

export const axiosBaseQuery =
  () =>
  async ({ url, method, data, params }) => {
    try {
<<<<<<< Updated upstream
      const baseURL = "https://localhost:7285/api"; // URL API của bạn
=======
      const baseURL = "https://reqres.in/api"; // URL API của bạn
>>>>>>> Stashed changes
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
    } catch (error) {
      return {
        error: {
          status: error.response?.status,
          data: error.response?.data || { error: "Something went wrong" },
        },
      };
    }
  };
