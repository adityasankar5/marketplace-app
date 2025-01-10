import React from "react";
import {
  Card,
  CardContent,
  CardMedia,
  Typography,
  Button,
  CardActions,
  Box,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function ProductCard({ product }) {
  const navigate = useNavigate();
  const { user, hasRole } = useAuth();

  if (!product) return null;

  const handleCardClick = () => {
    navigate(`/product/${product.id}`);
  };

  const handleEditClick = (e) => {
    e.stopPropagation();
    navigate(`/edit-product/${product.id}`);
  };

  const isSeller = hasRole("seller");
  const isProductOwner = user?.id === product.SellerId;
  const canEdit = isSeller && isProductOwner;

  return (
    <Card
      onClick={handleCardClick}
      sx={{
        height: "100%",
        display: "flex",
        flexDirection: "column",
        cursor: "pointer",
        transition: "transform 0.2s, box-shadow 0.2s",
        "&:hover": {
          transform: "translateY(-4px)",
          boxShadow: 3,
        },
      }}
    >
      <CardMedia
        component="img"
        height="200"
        image={product.ImageUrl || "https://via.placeholder.com/400x200"}
        alt={product.Name || "Product Image"}
        sx={{ objectFit: "cover" }}
      />
      <CardContent sx={{ flexGrow: 1 }}>
        <Typography gutterBottom variant="h5" component="h2">
          {product.Name || "Untitled Product"}
        </Typography>
        <Typography variant="body2" color="text.secondary" noWrap>
          {product.Description || "No description available"}
        </Typography>
        <Typography variant="h6" color="primary" sx={{ mt: 2 }}>
          ${(product.Price || 0).toFixed(2)}
        </Typography>
      </CardContent>
      <CardActions sx={{ justifyContent: "center", pb: 2 }}>
        <Box sx={{ display: "flex", gap: 1 }}>
          <Button
            variant="contained"
            color="primary"
            size="small"
            onClick={(e) => {
              e.stopPropagation();
              navigate(`/product/${product.id}`);
            }}
            sx={{
              minWidth: "120px",
              bgcolor: "primary.main",
              color: "white",
              "&:hover": {
                bgcolor: "primary.dark",
              },
            }}
          >
            {isSeller ? "View Details" : "Buy Now"}
          </Button>
          {canEdit && (
            <Button
              variant="contained"
              color="secondary"
              size="small"
              onClick={handleEditClick}
              sx={{
                minWidth: "120px",
                bgcolor: "secondary.main",
                color: "white",
                "&:hover": {
                  bgcolor: "secondary.dark",
                },
              }}
            >
              Edit
            </Button>
          )}
        </Box>
      </CardActions>
    </Card>
  );
}

export default ProductCard;
