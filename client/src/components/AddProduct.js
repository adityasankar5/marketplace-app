import React, { useState } from "react";
import {
  Paper,
  TextField,
  Button,
  Typography,
  Box,
  Alert,
  Container,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { api } from "../services/api";

function AddProduct() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    Name: "",
    Description: "",
    Price: "",
    ImageUrl: "",
  });
  const [error, setError] = useState(null);

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
        SellerId: user.id,
        CreatedAt: new Date().toISOString(),
      };

      await api.createProduct(productData);
      navigate("/");
    } catch (err) {
      setError("Error creating product");
    }
  };

  return (
    <Container maxWidth="sm">
      <Paper sx={{ p: 3, mt: 4 }}>
        <Typography variant="h5" gutterBottom>
          Add New Product
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
          <Button
            type="submit"
            variant="contained"
            color="primary"
            fullWidth
            sx={{ mt: 3 }}
          >
            Add Product
          </Button>
        </Box>
      </Paper>
    </Container>
  );
}

export default AddProduct;
