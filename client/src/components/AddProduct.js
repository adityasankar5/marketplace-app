import React, { useState } from "react";
import {
  Paper,
  TextField,
  Button,
  Typography,
  Box,
  Alert,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { api } from "../services/api";

function AddProduct() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    Name: "",
    Description: "",
    Price: "",
    ImageUrl: "",
    SellerId: "seller123",
  });
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;

    // Handle price input separately
    if (name === "Price") {
      // Only allow numbers and decimal point
      const regex = /^\d*\.?\d*$/;
      if (value === "" || regex.test(value)) {
        setFormData((prev) => ({
          ...prev,
          [name]: value,
        }));
      }
      return;
    }

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Convert price to number before sending
      const submitData = {
        ...formData,
        Price: Number(formData.Price),
      };

      await api.createProduct(submitData);
      navigate("/");
    } catch (err) {
      setError(err.response?.data?.details || "Error creating product");
    }
  };

  return (
    <Paper sx={{ p: 3, maxWidth: 600, mx: "auto" }}>
      <Typography variant="h5" gutterBottom>
        Add New Product
      </Typography>
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}
      <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
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
          inputProps={{
            step: "0.01",
            min: "0",
          }}
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
          sx={{ mt: 3 }}
          fullWidth
        >
          Add Product
        </Button>
      </Box>
    </Paper>
  );
}

export default AddProduct;
