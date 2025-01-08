import React from "react";
import { AppBar, Toolbar, Typography, Button, Box } from "@mui/material";
import { Link as RouterLink } from "react-router-dom";

function Navbar() {
  return (
    <AppBar position="static">
      <Toolbar>
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          Marketplace
        </Typography>
        <Box>
          <Button color="inherit" component={RouterLink} to="/">
            Products
          </Button>
          <Button color="inherit" component={RouterLink} to="/add-product">
            Add Product
          </Button>
          <Button color="inherit" component={RouterLink} to="/orders">
            Orders
          </Button>
        </Box>
      </Toolbar>
    </AppBar>
  );
}

export default Navbar;