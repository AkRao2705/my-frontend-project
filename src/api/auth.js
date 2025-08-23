import axiosInstance from "./axiosInstance";

export const signup = async (data) => {
  try {
    const response = await axiosInstance.post("/auth/signup", data);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.msg || "Signup failed");
  }
};

export const login = async (data) => {
  try {
    const response = await axiosInstance.post("/auth/login", data);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.msg || "Login failed");
  }
};
