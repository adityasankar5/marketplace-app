import React, { useState, useEffect } from "react";
import {
  Grid,
  TextField,
  Container,
  Box,
  InputAdornment,
  Typography,
} from "@mui/material";
import { Search as SearchIcon } from "@mui/icons-material";
import { useAuth } from "../context/AuthContext";
import { api } from "../services/api";
import ProductCard from "./ProductCard";
import Loading from "./common/Loading";
import ErrorDisplay from "./common/ErrorDisplay";
import Notification from "./common/Notification";

function ProductList() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [notification, setNotification] = useState({
    open: false,
    message: "",
    type: "success",
  });

  const fetchProducts = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await api.getAllProducts();
      setProducts(response.data || []); // Ensure products is always an array
    } catch (err) {
      console.error("Error fetching products:", err);
      setError("Failed to fetch products. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const filteredProducts = products.filter((product) => {
    // Add null checks
    if (!product) return false;

    const searchLower = searchTerm.toLowerCase();
    const nameMatch = product.Name
      ? product.Name.toLowerCase().includes(searchLower)
      : false;
    const descriptionMatch = product.Description
      ? product.Description.toLowerCase().includes(searchLower)
      : false;

    return nameMatch || descriptionMatch;
  });

  const handleNotificationClose = () => {
    setNotification((prev) => ({ ...prev, open: false }));
  };

  if (loading) return <Loading message="Loading products..." />;
  if (error) return <ErrorDisplay error={error} onRetry={fetchProducts} />;

  return (
    <Container maxWidth="lg">
      <Box sx={{ my: 4 }}>
        <TextField
          fullWidth
          variant="outlined"
          placeholder="Search products..."
          value={searchTerm}
          onChange={handleSearchChange}
          sx={{ mb: 4 }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
        />

        {filteredProducts.length === 0 ? (
          <Typography
            variant="h6"
            color="text.secondary"
            align="center"
            sx={{ mt: 4 }}
          >
            {searchTerm
              ? "No products found matching your search"
              : "No products available"}
          </Typography>
        ) : (
          <Grid container spacing={3}>
            {filteredProducts.map((product) => (
              <Grid item xs={12} sm={6} md={4} key={product.id}>
                <ProductCard product={product} />
              </Grid>
            ))}
          </Grid>
        )}
      </Box>

      <Notification
        open={notification.open}
        message={notification.message}
        type={notification.type}
        onClose={handleNotificationClose}
      />
    </Container>
  );
}

export default ProductList;
