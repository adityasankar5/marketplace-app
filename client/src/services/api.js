import axios from "axios";

const API_URL = "https://marketplaceapp-server.vercel.app"; // Use the permanent URL from Vercel

// Create axios instance for authenticated requests
const axiosInstance = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Create public axios instance
const publicAxios = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor for authenticated requests
axiosInstance.interceptors.request.use(
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

export const api = {
  // Public endpoints
  getAllProducts: () => publicAxios.get("/products"),
  getProductById: (id) => publicAxios.get(`/products/${id}`),

  // Auth endpoints
  login: (credentials) => axiosInstance.post("/api/auth/login", credentials),
  register: (userData) => axiosInstance.post("/api/auth/register", userData),

  // Protected endpoints
  createProduct: (productData) =>
    axiosInstance.post("/api/products", productData),
  updateProduct: (id, productData) =>
    axiosInstance.put(`/api/products/${id}`, productData),
  deleteProduct: (id) => axiosInstance.delete(`/api/products/${id}`),

  // Order endpoints
  createOrder: (orderData) => axiosInstance.post("/api/orders", orderData),
  getMyOrders: () => axiosInstance.get("/api/orders/my-orders"),
  getReceivedOrders: () => axiosInstance.get("/api/orders/received-orders"),
  updateOrderStatus: (orderId, status) =>
    axiosInstance.patch(`/api/orders/${orderId}/status`, { status }),
};
