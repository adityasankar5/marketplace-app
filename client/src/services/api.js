import axios from "axios";

const API_URL = "http://localhost:5000/api";

// Add request interceptor to include auth token
axios.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add response interceptor for error handling
axios.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("token");
      window.location.href = "/login";
    }
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
