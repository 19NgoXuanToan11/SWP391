import axios from "axios";

export const loginAPI = (email, password) => {
  return axios.post("/api/login", { email, password });
};
