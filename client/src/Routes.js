import React from "react";
import { Routes as RouterRoutes, Route } from "react-router-dom";
import ProductList from "./components/ProductList";
import ProductDetails from "./components/ProductDetails";
import AddProduct from "./components/AddProduct";
import EditProduct from "./components/EditProduct";
import Orders from "./components/Orders";
import Login from "./components/auth/Login";
import Register from "./components/auth/Register";
import ProtectedRoute from "./components/auth/ProtectedRoute";

function Routes() {
  return (
    <RouterRoutes>
      {/* Public routes */}
      <Route path="/" element={<ProductList />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/product/:id" element={<ProductDetails />} />

      {/* Protected routes - Seller only */}
      <Route
        path="/add-product"
        element={
          <ProtectedRoute roles={["seller"]}>
            <AddProduct />
          </ProtectedRoute>
        }
      />

      <Route
        path="/edit-product/:id"
        element={
          <ProtectedRoute roles={["seller"]}>
            <EditProduct />
          </ProtectedRoute>
        }
      />

      {/* Protected routes - Any authenticated user */}
      <Route
        path="/orders"
        element={
          <ProtectedRoute>
            <Orders />
          </ProtectedRoute>
        }
      />
    </RouterRoutes>
  );
}

export default Routes;
