import React, { useState } from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  IconButton,
  Box,
  Menu,
  MenuItem,
  Avatar,
  useTheme,
  useMediaQuery,
  Drawer,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Divider,
} from "@mui/material";
import {
  Menu as MenuIcon,
  ShoppingCart as CartIcon,
  Person as PersonIcon,
  Store as StoreIcon,
  ExitToApp as LogoutIcon,
  Login as LoginIcon,
  Assignment as OrdersIcon,
  Add as AddIcon,
} from "@mui/icons-material";
import { Link as RouterLink, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function Navbar() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const navigate = useNavigate();
  const location = useLocation();
  const auth = useAuth();
  const [anchorEl, setAnchorEl] = useState(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  if (!auth) return null;

  const { user, logout, hasRole } = auth;

  const handleProfileMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    handleMenuClose();
    logout();
    navigate("/login");
  };

  const handleMobileMenuClose = () => {
    setMobileMenuOpen(false);
  };

  const menuItems = [
    {
      text: "Products",
      icon: <StoreIcon />,
      path: "/",
      show: true,
    },
    {
      text: "Add Product",
      icon: <AddIcon />,
      path: "/add-product",
      show: hasRole("seller"),
    },
    {
      text: "My Orders",
      icon: <OrdersIcon />,
      path: "/orders",
      show: user,
    },
  ];

  const profileMenuItems = [
    {
      text: "Profile",
      icon: <PersonIcon />,
      onClick: () => {
        handleMenuClose();
        navigate("/profile");
      },
      show: true,
    },
    {
      text: "Logout",
      icon: <LogoutIcon />,
      onClick: handleLogout,
      show: true,
    },
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <AppBar
      position="sticky"
      elevation={0}
      sx={{
        bgcolor: "background.paper",
        borderBottom: 1,
        borderColor: "divider",
      }}
    >
      <Toolbar>
        {isMobile && (
          <IconButton
            edge="start"
            color="inherit"
            onClick={() => setMobileMenuOpen(true)}
            sx={{ mr: 2 }}
          >
            <MenuIcon />
          </IconButton>
        )}

        <Typography
          variant="h6"
          component={RouterLink}
          to="/"
          sx={{
            textDecoration: "none",
            color: "primary.main",
            fontWeight: 700,
            flexGrow: isMobile ? 1 : 0,
            mr: isMobile ? 0 : 3,
          }}
        >
          Marketplace
        </Typography>

        {!isMobile && (
          <Box sx={{ flexGrow: 1, display: "flex", gap: 2 }}>
            {menuItems
              .filter((item) => item.show)
              .map((item) => (
                <Button
                  key={item.text}
                  component={RouterLink}
                  to={item.path}
                  startIcon={item.icon}
                  sx={{
                    color: isActive(item.path)
                      ? "primary.main"
                      : "text.primary",
                    "&:hover": {
                      bgcolor: "action.hover",
                    },
                  }}
                >
                  {item.text}
                </Button>
              ))}
          </Box>
        )}

        <Box sx={{ ml: "auto", display: "flex", alignItems: "center" }}>
          {user ? (
            <>
              {!isMobile && (
                <Typography variant="subtitle2" sx={{ mr: 2 }}>
                  {user.username}
                </Typography>
              )}
              <IconButton
                onClick={handleProfileMenuOpen}
                size="small"
                sx={{ ml: 1 }}
              >
                <Avatar
                  sx={{
                    width: 32,
                    height: 32,
                    bgcolor: "primary.main",
                    fontSize: "1rem",
                  }}
                >
                  {user.username?.[0]?.toUpperCase()}
                </Avatar>
              </IconButton>
            </>
          ) : (
            <Button
              color="primary"
              variant="contained"
              component={RouterLink}
              to="/login"
              startIcon={<LoginIcon />}
            >
              Login
            </Button>
          )}
        </Box>

        {/* Profile Menu */}
        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={handleMenuClose}
          transformOrigin={{ horizontal: "right", vertical: "top" }}
          anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
        >
          {profileMenuItems
            .filter((item) => item.show)
            .map((item) => (
              <MenuItem key={item.text} onClick={item.onClick}>
                <ListItemIcon>{item.icon}</ListItemIcon>
                <ListItemText primary={item.text} />
              </MenuItem>
            ))}
        </Menu>

        {/* Mobile Drawer */}
        <Drawer
          anchor="left"
          open={mobileMenuOpen}
          onClose={handleMobileMenuClose}
        >
          <Box sx={{ width: 250 }} role="presentation">
            <List>
              {menuItems
                .filter((item) => item.show)
                .map((item) => (
                  <ListItem
                    key={item.text}
                    button
                    component={RouterLink}
                    to={item.path}
                    onClick={handleMobileMenuClose}
                    selected={isActive(item.path)}
                  >
                    <ListItemIcon
                      sx={{
                        color: isActive(item.path) ? "primary.main" : "inherit",
                      }}
                    >
                      {item.icon}
                    </ListItemIcon>
                    <ListItemText primary={item.text} />
                  </ListItem>
                ))}
            </List>
            {user && (
              <>
                <Divider />
                <List>
                  {profileMenuItems
                    .filter((item) => item.show)
                    .map((item) => (
                      <ListItem
                        key={item.text}
                        button
                        onClick={() => {
                          handleMobileMenuClose();
                          item.onClick();
                        }}
                      >
                        <ListItemIcon>{item.icon}</ListItemIcon>
                        <ListItemText primary={item.text} />
                      </ListItem>
                    ))}
                </List>
              </>
            )}
          </Box>
        </Drawer>
      </Toolbar>
    </AppBar>
  );
}

export default Navbar;
