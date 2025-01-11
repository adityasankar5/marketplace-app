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

// Response interceptor
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Only redirect to login if not already on login page
      if (!window.location.pathname.includes("/login")) {
        localStorage.removeItem("token");
        window.location.href = "/login";
      }
    }
    return Promise.reject(error);
  }
);

export const api = {
  // Auth endpoints
  login: (credentials) => axiosInstance.post("/auth/login", credentials),
  register: (userData) => axiosInstance.post("/auth/register", userData),

  // Public endpoints (no auth required)
  getAllProducts: () => axios.get(`${API_URL}/products`), // Using axios directly
  getProductById: (id) => axios.get(`${API_URL}/products/${id}`), // Using axios directly

  // Protected endpoints (auth required)
  createProduct: (productData) => axiosInstance.post("/products", productData),
  updateProduct: (id, productData) =>
    axiosInstance.put(`/products/${id}`, productData),
  deleteProduct: (id) => axiosInstance.delete(`/products/${id}`),

  // Order endpoints (all protected)
  createOrder: (orderData) => axiosInstance.post("/orders", orderData),
  getMyOrders: () => axiosInstance.get("/orders/my-orders"),
  getReceivedOrders: () => axiosInstance.get("/orders/received-orders"),
  updateOrderStatus: (orderId, status) =>
    axiosInstance.patch(`/orders/${orderId}/status`, { status }),
};
