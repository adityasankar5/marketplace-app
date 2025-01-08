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
} from "@mui/material";
import { api } from "../services/api";

function ProductDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchProductDetails();
  }, [id]);

  const fetchProductDetails = async () => {
    try {
      const response = await api.getProductById(id);
      setProduct(response.data);
      setLoading(false);
    } catch (err) {
      setError("Error fetching product details");
      setLoading(false);
    }
  };

  const handlePurchase = async () => {
    try {
      await api.createOrder({
        productId: id,
        quantity: 1,
      });
      navigate("/orders");
    } catch (err) {
      setError("Error placing order");
    }
  };

  if (loading) return <CircularProgress />;
  if (error) return <Alert severity="error">{error}</Alert>;
  if (!product) return <Alert severity="info">Product not found</Alert>;

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
                sx={{ mt: 2 }}
              >
                Purchase Now
              </Button>
            </Box>
          </Grid>
        </Grid>
      </Paper>
    </Container>
  );
}

export default ProductDetails;
