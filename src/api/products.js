import axiosInstance from "./axiosInstance"; // adjust path if needed

export const fetchProducts = async () => {
  try {
    const response = await axiosInstance.get("/products");
    return response.data;
  } catch (error) {
    throw new Error("Failed to fetch products");
  }
};
