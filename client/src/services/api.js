import axios from "axios";

const API_URL = "http://localhost:5000/api";

// Add response interceptor for better error handling
axios.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error("API Error:", error.response?.data || error.message);
    return Promise.reject(error);
  }
);

export const api = {
  // Product APIs
  getAllProducts: () => axios.get(`${API_URL}/products`),
  getProductById: (id) => axios.get(`${API_URL}/products/${id}`),
  createProduct: (productData) =>
    axios.post(`${API_URL}/products`, productData),

  // Order APIs
  createOrder: (orderData) => {
    console.log("Creating order with:", orderData);
    return axios.post(`${API_URL}/orders`, orderData);
  },
  getOrders: () => axios.get(`${API_URL}/orders`),
  updateOrderStatus: (orderId, newStatus) =>
    axios.patch(`${API_URL}/orders/${orderId}/status`, { status: newStatus }),
};
