import axios from "axios";

const API_URL =
  process.env.REACT_APP_API_URL ||
  "https://marketplaceserver-q9tv3r91z-adityasankar-senguptas-projects.vercel.app";
// Add request interceptor to include auth token
axios.defaults.withCredentials = true;
axios.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    config.withCredentials = true;
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export const api = {
  // Auth endpoints
  login: (credentials) => axios.post(`${API_URL}/auth/login`, credentials),
  register: (userData) => axios.post(`${API_URL}/auth/register`, userData),

  // Product endpoints
  getAllProducts: () => axios.get(`${API_URL}/products`),
  getProductById: (id) => axios.get(`${API_URL}/products/${id}`),
  createProduct: (productData) =>
    axios.post(`${API_URL}/products`, productData),
  updateProduct: (id, productData) =>
    axios.put(`${API_URL}/products/${id}`, productData),
  deleteProduct: (id) => axios.delete(`${API_URL}/products/${id}`),

  // Order endpoints
  createOrder: (orderData) => axios.post(`${API_URL}/orders`, orderData),
  getMyOrders: () => axios.get(`${API_URL}/orders/my-orders`),
  getReceivedOrders: () => axios.get(`${API_URL}/orders/received-orders`),
  updateOrderStatus: (orderId, status) =>
    axios.patch(`${API_URL}/orders/${orderId}/status`, { status }),
};
