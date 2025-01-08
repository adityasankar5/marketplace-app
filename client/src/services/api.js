import axios from "axios";

const API_URL = "http://localhost:5000/api";

export const api = {
  // Product APIs
  getAllProducts: () => axios.get(`${API_URL}/products`),
  getProductById: (id) => axios.get(`${API_URL}/products/${id}`),
  createProduct: (productData) =>
    axios.post(`${API_URL}/products`, productData),

  // Order APIs
  createOrder: (orderData) => axios.post(`${API_URL}/orders`, orderData),
  getOrders: () => axios.get(`${API_URL}/orders`),
};
