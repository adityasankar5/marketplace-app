import React, { useState, useEffect } from "react";
import {
  Container,
  Paper,
  Grid,
  Typography,
  Button,
  Box,
  CircularProgress,
  Alert,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { api } from "../services/api";

function ProductDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, hasRole } = useAuth();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [orderConfirmation, setOrderConfirmation] = useState({
    open: false,
    orderId: null,
    orderDetails: null,
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
      setError("Error fetching product details");
      setLoading(false);
    }
  };

  const handlePurchase = async () => {
    if (!user) {
      navigate("/login");
      return;
    }

    try {
      const orderData = {
        productId: id,
        buyerId: user.id,
        sellerId: product.SellerId,
        quantity: quantity,
        status: "Pending",
        createdAt: new Date().toISOString(),
        totalPrice: product.Price * quantity,
      };

      const response = await api.createOrder(orderData);
      setOrderConfirmation({
        open: true,
        orderId: response.data[0].id,
        orderDetails: {
          ...orderData,
          productName: product.Name,
        },
      });
    } catch (err) {
      setError("Error placing order");
    }
  };

  const handleConfirmationClose = () => {
    setOrderConfirmation({ open: false, orderId: null, orderDetails: null });
    navigate("/orders");
  };

  const canEditProduct = () => {
    return user && hasRole("seller") && user.id === product?.SellerId;
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
              <Box
                display="flex"
                justifyContent="space-between"
                alignItems="center"
              >
                <Typography variant="h4" gutterBottom>
                  {product.Name}
                </Typography>
                {canEditProduct() && (
                  <IconButton
                    onClick={() => navigate(`/edit-product/${id}`)}
                    color="primary"
                  >
                    <EditIcon />
                  </IconButton>
                )}
              </Box>
              <Typography variant="h5" color="primary" gutterBottom>
                ${product.Price}
              </Typography>
              <Typography variant="body1" paragraph>
                {product.Description}
              </Typography>

              {hasRole("buyer") && (
                <>
                  <FormControl fullWidth sx={{ mt: 2, mb: 3 }}>
                    <InputLabel>Quantity</InputLabel>
                    <Select
                      value={quantity}
                      label="Quantity"
                      onChange={(e) => setQuantity(e.target.value)}
                    >
                      {[1, 2, 3, 4, 5].map((num) => (
                        <MenuItem key={num} value={num}>
                          {num}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>

                  <Typography variant="h6" gutterBottom>
                    Total: ${(product.Price * quantity).toFixed(2)}
                  </Typography>

                  <Button
                    variant="contained"
                    color="primary"
                    size="large"
                    onClick={handlePurchase}
                    fullWidth
                    sx={{ mt: 2 }}
                  >
                    {user ? "Purchase Now" : "Login to Purchase"}
                  </Button>
                </>
              )}
            </Box>
          </Grid>
        </Grid>
      </Paper>

      <Dialog
        open={orderConfirmation.open}
        onClose={handleConfirmationClose}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Order Placed Successfully!</DialogTitle>
        <DialogContent>
          {orderConfirmation.orderDetails && (
            <Box sx={{ mt: 2 }}>
              <Typography variant="h6" gutterBottom>
                Order Details:
              </Typography>
              <Typography>
                Product: {orderConfirmation.orderDetails.productName}
              </Typography>
              <Typography>
                Quantity: {orderConfirmation.orderDetails.quantity}
              </Typography>
              <Typography>
                Total Price: $
                {orderConfirmation.orderDetails.totalPrice.toFixed(2)}
              </Typography>
              <Typography>Order ID: {orderConfirmation.orderId}</Typography>
              <Typography>
                Status: {orderConfirmation.orderDetails.status}
              </Typography>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleConfirmationClose} color="primary">
            View My Orders
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
}

export default ProductDetails;
