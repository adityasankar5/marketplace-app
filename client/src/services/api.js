import axios from "axios";

const API_URL = "http://localhost:5000/api";

export const api = {
  // Product APIs
  getAllProducts: () => axios.get(`${API_URL}/products`),
  createProduct: (productData) =>
    axios.post(`${API_URL}/products`, productData),
  // We'll add more API methods as needed
};
