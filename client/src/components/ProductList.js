import React, { useState, useEffect } from "react";
import {
  Grid,
  Card,
  CardContent,
  CardMedia,
  Typography,
  Button,
  CircularProgress,
  TextField,
  Container,
  Box,
  CardActions,
  IconButton,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { api } from "../services/api";

function ProductList() {
  const navigate = useNavigate();
  const { user, hasRole } = useAuth();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await api.getAllProducts();
      setProducts(response.data || []); // Ensure products is always an array
      setLoading(false);
    } catch (err) {
      setError("Error fetching products");
      setLoading(false);
    }
  };

  const handleEditProduct = (e, productId) => {
    e.stopPropagation();
    navigate(`/edit-product/${productId}`);
  };

  const handleCardClick = (productId) => {
    navigate(`/product/${productId}`);
  };

  const canEditProduct = (sellerId) => {
    return user && hasRole("seller") && user.id === sellerId;
  };

  const filteredProducts = products.filter((product) => {
    if (!product || !product.Name || !product.Description) return false;
    return (
      product.Name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.Description.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  if (loading)
    return (
      <Box display="flex" justifyContent="center" mt={4}>
        <CircularProgress />
      </Box>
    );

  if (error)
    return (
      <Box mt={4}>
        <Typography color="error" align="center">
          {error}
        </Typography>
      </Box>
    );

  return (
    <Container maxWidth="lg">
      <Box sx={{ my: 4 }}>
        <TextField
          fullWidth
          label="Search Products"
          variant="outlined"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          sx={{ mb: 4 }}
        />

        {filteredProducts.length === 0 ? (
          <Typography align="center" sx={{ mt: 4 }}>
            No products found
          </Typography>
        ) : (
          <Grid container spacing={3}>
            {filteredProducts.map((product) => (
              <Grid item xs={12} sm={6} md={4} key={product.id}>
                <Card
                  sx={{
                    height: "100%",
                    display: "flex",
                    flexDirection: "column",
                    cursor: "pointer",
                    "&:hover": {
                      boxShadow: 6,
                    },
                  }}
                  onClick={() => handleCardClick(product.id)}
                >
                  <CardMedia
                    component="img"
                    height="200"
                    image={
                      product.ImageUrl || "https://via.placeholder.com/200"
                    }
                    alt={product.Name}
                    sx={{ objectFit: "cover" }}
                  />
                  <CardContent sx={{ flexGrow: 1 }}>
                    <Typography gutterBottom variant="h5" component="h2">
                      {product.Name}
                    </Typography>
                    <Typography noWrap>{product.Description}</Typography>
                    <Typography variant="h6" color="primary" sx={{ mt: 2 }}>
                      ${product.Price?.toFixed(2) || "0.00"}
                    </Typography>
                  </CardContent>
                  <CardActions>
                    <Button size="small" color="primary">
                      View Details
                    </Button>
                    {canEditProduct(product.SellerId) && (
                      <IconButton
                        size="small"
                        color="primary"
                        onClick={(e) => handleEditProduct(e, product.id)}
                      >
                        <EditIcon />
                      </IconButton>
                    )}
                  </CardActions>
                </Card>
              </Grid>
            ))}
          </Grid>
        )}
      </Box>
    </Container>
  );
}

export default ProductList;
