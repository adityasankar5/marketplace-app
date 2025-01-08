import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Grid,
  Card,
  CardContent,
  CardMedia,
  Typography,
  Button,
  CircularProgress,
} from "@mui/material";
import { api } from "../services/api";

function ProductList() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await api.getAllProducts();
      setProducts(response.data);
      setLoading(false);
    } catch (err) {
      setError("Error fetching products");
      setLoading(false);
    }
  };

  if (loading) return <CircularProgress />;
  if (error) return <Typography color="error">{error}</Typography>;

  return (
    <Grid container spacing={3}>
      {products.map((product) => (
        <Grid item xs={12} sm={6} md={4} key={product.id}>
          <Card
            onClick={() => navigate(`/product/${product.id}`)}
            sx={{ cursor: "pointer" }}
          >
            <CardMedia
              component="img"
              height="140"
              image={product.ImageUrl || "https://via.placeholder.com/140"}
              alt={product.Name}
            />
            <CardContent>
              <Typography gutterBottom variant="h5" component="div">
                {product.Name}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {product.Description}
              </Typography>
              <Typography variant="h6" color="primary" sx={{ mt: 2 }}>
                ${product.Price}
              </Typography>
              <Button variant="contained" color="primary" sx={{ mt: 2 }}>
                Buy Now
              </Button>
            </CardContent>
          </Card>
        </Grid>
      ))}
    </Grid>
  );
}

export default ProductList;
