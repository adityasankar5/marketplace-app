import axios from "axios";

const API_URL =
  "https://marketplaceapp-server-gent1vo2h-adityasankar-senguptas-projects.vercel.app";

// Create axios instance
const axiosInstance = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor
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
  // Auth endpoints
  login: (credentials) => axiosInstance.post("/auth/login", credentials),
  register: (userData) => axiosInstance.post("/auth/register", userData),

  // Product endpoints
  getAllProducts: () => axiosInstance.get("/products"),
  getProductById: (id) => axiosInstance.get(`/products/${id}`),
  createProduct: (productData) => axiosInstance.post("/products", productData),
  updateProduct: (id, productData) =>
    axiosInstance.put(`/products/${id}`, productData),
  deleteProduct: (id) => axiosInstance.delete(`/products/${id}`),

  // Order endpoints
  createOrder: (orderData) => axiosInstance.post("/orders", orderData),
  getMyOrders: () => axiosInstance.get("/orders/my-orders"),
  getReceivedOrders: () => axiosInstance.get("/orders/received-orders"),
  updateOrderStatus: (orderId, status) =>
    axiosInstance.patch(`/orders/${orderId}/status`, { status }),
};
