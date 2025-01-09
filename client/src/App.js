import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import {
  Container,
  CssBaseline,
  ThemeProvider,
  createTheme,
} from "@mui/material";
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./components/auth/ProtectedRoute";
import Navbar from "./components/Navbar";
import ProductList from "./components/ProductList";
import AddProduct from "./components/AddProduct";
import EditProduct from "./components/EditProduct";
import ProductDetails from "./components/ProductDetails";
import Orders from "./components/Orders";
import Login from "./components/auth/Login";
import Register from "./components/auth/Register";
import "./App.css";

const theme = createTheme({
  palette: {
    primary: {
      main: "#1976d2",
    },
    secondary: {
      main: "#dc004e",
    },
  },
});

function App() {
  return (
    <AuthProvider>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Router>
          <div className="App">
            <Navbar />
            <Container maxWidth="lg" sx={{ mt: 4 }}>
              <Routes>
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
                    <ProtectedRoute roles={["buyer", "seller"]}>
                      <Orders />
                    </ProtectedRoute>
                  }
                />
              </Routes>
            </Container>
          </div>
        </Router>
      </ThemeProvider>
    </AuthProvider>
  );
}

export default App;
