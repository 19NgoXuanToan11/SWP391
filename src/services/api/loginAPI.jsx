import axios from "axios";

export const fakeAuthAPI = async (email, password) => {
  try {
    const response = await axios.post("https://reqres.in/api/login", {
      email: email,
      password: password,
    }); 
    return response.data;
  } catch (error) {
    console.error("Error during authentication:", error);
    throw error;
  }
};
