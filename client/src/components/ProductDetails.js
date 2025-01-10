import React, { useState, useEffect } from "react";
import {
  Container,
  Paper,
  Grid,
  Typography,
  Button,
  Box,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
} from "@mui/material";
import {
  Edit as EditIcon,
  ArrowBack as ArrowBackIcon,
} from "@mui/icons-material";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { api } from "../services/api";
import Loading from "./common/Loading";
import ErrorDisplay from "./common/ErrorDisplay";
import Notification from "./common/Notification";

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
    loading: false,
  });
  const [notification, setNotification] = useState({
    open: false,
    message: "",
    type: "success",
  });

  useEffect(() => {
    fetchProductDetails();
  }, [id]);

  const fetchProductDetails = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await api.getProductById(id);
      setProduct(response.data);
    } catch (err) {
      setError("Failed to fetch product details");
    } finally {
      setLoading(false);
    }
  };

  const handlePurchaseClick = () => {
    if (!user) {
      setNotification({
        open: true,
        message: "Please login to make a purchase",
        type: "warning",
      });
      return;
    }
    setOrderConfirmation({ open: true, loading: false });
  };

  const handleConfirmPurchase = async () => {
    try {
      setOrderConfirmation((prev) => ({ ...prev, loading: true }));

      const orderData = {
        productId: id,
        quantity: quantity,
        totalPrice: product.Price * quantity,
      };

      await api.createOrder(orderData);

      setOrderConfirmation({ open: false, loading: false });
      setNotification({
        open: true,
        message: "Order placed successfully!",
        type: "success",
      });

      setTimeout(() => navigate("/orders"), 2000);
    } catch (err) {
      setOrderConfirmation({ open: false, loading: false });
      setNotification({
        open: true,
        message: "Failed to place order. Please try again.",
        type: "error",
      });
    }
  };

  if (loading) return <Loading message="Loading product details..." />;
  if (error)
    return <ErrorDisplay error={error} onRetry={fetchProductDetails} />;
  if (!product) return <ErrorDisplay error="Product not found" />;

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Button
        component={Link}
        to="/"
        startIcon={<ArrowBackIcon />}
        sx={{ mb: 3 }}
      >
        BACK TO PRODUCTS
      </Button>

      <Grid container spacing={4}>
        {/* Product Image */}
        <Grid item xs={12} md={6}>
          <Box sx={{ position: "relative" }}>
            <img
              src={product.ImageUrl}
              alt={product.Name}
              style={{
                width: "100%",
                height: "auto",
                borderRadius: "8px",
                boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
              }}
            />
            {user && hasRole("seller") && user.id === product.SellerId && (
              <IconButton
                color="primary"
                sx={{
                  position: "absolute",
                  top: 8,
                  right: 8,
                  bgcolor: "white",
                }}
                onClick={() => navigate(`/edit-product/${id}`)}
              >
                <EditIcon />
              </IconButton>
            )}
          </Box>
        </Grid>

        {/* Product Details */}
        <Grid item xs={12} md={6}>
          <Box
            sx={{ height: "100%", display: "flex", flexDirection: "column" }}
          >
            <Typography variant="h3" component="h1" gutterBottom>
              {product.Name}
            </Typography>

            <Typography variant="h4" color="primary" gutterBottom>
              ${product.Price.toFixed(2)}
            </Typography>

            <Typography variant="body1" sx={{ mt: 2, mb: 4 }}>
              {product.Description}
            </Typography>

            {hasRole("seller") ? (
              // Seller view
              user?.id === product.SellerId && (
                <Box sx={{ mt: "auto" }}>
                  <Button
                    variant="contained"
                    color="secondary"
                    size="large"
                    fullWidth
                    onClick={() => navigate(`/edit-product/${id}`)}
                  >
                    Edit Product
                  </Button>
                </Box>
              )
            ) : // Buyer view
            !user ? (
              <Alert
                severity="info"
                sx={{ mt: "auto" }}
                action={
                  <Button
                    color="inherit"
                    size="small"
                    onClick={() => navigate("/login")}
                  >
                    LOGIN
                  </Button>
                }
              >
                Please login to make a purchase
              </Alert>
            ) : (
              <Box sx={{ mt: "auto" }}>
                <FormControl fullWidth sx={{ mb: 3 }}>
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

                <Box
                  sx={{
                    bgcolor: "grey.100",
                    p: 2,
                    borderRadius: 1,
                    mb: 3,
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <Typography variant="subtitle1">Total Price:</Typography>
                  <Typography variant="h6">
                    ${(product.Price * quantity).toFixed(2)}
                  </Typography>
                </Box>

                <Button
                  variant="contained"
                  color="primary"
                  size="large"
                  fullWidth
                  onClick={handlePurchaseClick}
                >
                  Purchase Now
                </Button>
              </Box>
            )}
          </Box>
        </Grid>
      </Grid>

      {/* Purchase Confirmation Dialog */}
      <Dialog
        open={orderConfirmation.open}
        onClose={() =>
          !orderConfirmation.loading &&
          setOrderConfirmation({ open: false, loading: false })
        }
      >
        <DialogTitle>Confirm Purchase</DialogTitle>
        <DialogContent>
          <Box sx={{ py: 2 }}>
            <Typography variant="subtitle1" gutterBottom>
              {product.Name}
            </Typography>
            <Typography variant="body2" gutterBottom>
              Quantity: {quantity}
            </Typography>
            <Typography variant="h6" sx={{ mt: 2 }}>
              Total: ${(product.Price * quantity).toFixed(2)}
            </Typography>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() =>
              setOrderConfirmation({ open: false, loading: false })
            }
            disabled={orderConfirmation.loading}
          >
            Cancel
          </Button>
          <Button
            onClick={handleConfirmPurchase}
            variant="contained"
            color="primary"
            disabled={orderConfirmation.loading}
          >
            {orderConfirmation.loading ? "Processing..." : "Confirm Purchase"}
          </Button>
        </DialogActions>
      </Dialog>

      <Notification
        open={notification.open}
        message={notification.message}
        type={notification.type}
        onClose={() => setNotification((prev) => ({ ...prev, open: false }))}
      />
    </Container>
  );
}

export default ProductDetails;
