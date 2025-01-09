import React, { useState, useEffect } from "react";
import {
  Paper,
  TextField,
  Button,
  Typography,
  Box,
  Alert,
  Container,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  CircularProgress,
} from "@mui/material";
import { useNavigate, useParams } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { api } from "../services/api";

function EditProduct() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    Name: "",
    Description: "",
    Price: "",
    ImageUrl: "",
  });
  const [error, setError] = useState(null);
  const [deleteDialog, setDeleteDialog] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProduct();
  }, [id]);

  const fetchProduct = async () => {
    try {
      const response = await api.getProductById(id);
      const product = response.data;

      // Verify ownership
      if (product.SellerId !== user.id) {
        navigate("/");
        return;
      }

      setFormData(product);
      setLoading(false);
    } catch (err) {
      setError("Error fetching product");
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const productData = {
        ...formData,
        Price: parseFloat(formData.Price),
      };

      await api.updateProduct(id, productData);
      navigate("/");
    } catch (err) {
      setError("Error updating product");
    }
  };

  const handleDelete = async () => {
    try {
      await api.deleteProduct(id);
      navigate("/");
    } catch (err) {
      setError("Error deleting product");
    }
  };

  if (loading) return <CircularProgress />;

  return (
    <Container maxWidth="sm">
      <Paper sx={{ p: 3, mt: 4 }}>
        <Typography variant="h5" gutterBottom>
          Edit Product
        </Typography>
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}
        <Box component="form" onSubmit={handleSubmit}>
          <TextField
            fullWidth
            label="Product Name"
            name="Name"
            value={formData.Name}
            onChange={handleChange}
            margin="normal"
            required
          />
          <TextField
            fullWidth
            label="Description"
            name="Description"
            value={formData.Description}
            onChange={handleChange}
            margin="normal"
            multiline
            rows={4}
            required
          />
          <TextField
            fullWidth
            label="Price"
            name="Price"
            type="number"
            value={formData.Price}
            onChange={handleChange}
            margin="normal"
            required
            inputProps={{ min: 0, step: "0.01" }}
          />
          <TextField
            fullWidth
            label="Image URL"
            name="ImageUrl"
            value={formData.ImageUrl}
            onChange={handleChange}
            margin="normal"
            required
          />
          <Box sx={{ mt: 3, display: "flex", gap: 2 }}>
            <Button type="submit" variant="contained" color="primary" fullWidth>
              Update Product
            </Button>
            <Button
              variant="contained"
              color="error"
              fullWidth
              onClick={() => setDeleteDialog(true)}
            >
              Delete Product
            </Button>
          </Box>
        </Box>
      </Paper>

      <Dialog open={deleteDialog} onClose={() => setDeleteDialog(false)}>
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          Are you sure you want to delete this product?
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialog(false)}>Cancel</Button>
          <Button onClick={handleDelete} color="error">
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
}

export default EditProduct;
