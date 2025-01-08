import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Container,
  Paper,
  Grid,
  Typography,
  Button,
  Box,
  CircularProgress,
  Alert,
  Snackbar,
} from "@mui/material";
import { api } from "../services/api";

function ProductDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [orderStatus, setOrderStatus] = useState({
    loading: false,
    error: null,
  });

  useEffect(() => {
    fetchProductDetails();
  }, [id]);

  const fetchProductDetails = async () => {
    try {
      const response = await api.getProductById(id);
      setProduct(response.data);
      setLoading(false);
    } catch (err) {
      console.error("Error fetching product:", err);
      setError("Error fetching product details");
      setLoading(false);
    }
  };

  const handlePurchase = async () => {
    try {
      setOrderStatus({ loading: true, error: null });

      // Format today's date as DD-MM-YYYY
      const today = new Date();
      const formattedDate = `${today.getDate()}-${
        today.getMonth() + 1
      }-${today.getFullYear()}`;

      const orderData = {
        productId: id,
        quantity: 1,
        status: "Pending",
        createdAt: formattedDate,
        totalPrice: product.Price, // Assuming product.Price contains the price
      };

      console.log("Sending order with data:", orderData);

      const response = await api.createOrder(orderData);
      console.log("Order response:", response);

      setOrderStatus({ loading: false, error: null });
      navigate("/orders");
    } catch (err) {
      console.error("Error placing order:", err);
      setOrderStatus({
        loading: false,
        error: err.response?.data?.details || "Error placing order",
      });
    }
  };

  if (loading)
    return (
      <Container sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
        <CircularProgress />
      </Container>
    );

  if (error)
    return (
      <Container sx={{ mt: 4 }}>
        <Alert severity="error">{error}</Alert>
      </Container>
    );

  if (!product)
    return (
      <Container sx={{ mt: 4 }}>
        <Alert severity="info">Product not found</Alert>
      </Container>
    );

  return (
    <Container maxWidth="lg" sx={{ mt: 4 }}>
      <Paper elevation={3}>
        <Grid container spacing={4}>
          <Grid item xs={12} md={6}>
            <img
              src={product.ImageUrl}
              alt={product.Name}
              style={{
                width: "100%",
                height: "auto",
                maxHeight: "500px",
                objectFit: "cover",
              }}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <Box p={3}>
              <Typography variant="h4" gutterBottom>
                {product.Name}
              </Typography>
              <Typography variant="h5" color="primary" gutterBottom>
                ${product.Price}
              </Typography>
              <Typography variant="body1" paragraph>
                {product.Description}
              </Typography>
              <Button
                variant="contained"
                color="primary"
                size="large"
                onClick={handlePurchase}
                disabled={orderStatus.loading}
                sx={{ mt: 2 }}
              >
                {orderStatus.loading ? "Processing..." : "Purchase Now"}
              </Button>
            </Box>
          </Grid>
        </Grid>
      </Paper>

      <Snackbar
        open={!!orderStatus.error}
        autoHideDuration={6000}
        onClose={() => setOrderStatus((prev) => ({ ...prev, error: null }))}
      >
        <Alert severity="error">{orderStatus.error}</Alert>
      </Snackbar>
    </Container>
  );
}

export default ProductDetails;
