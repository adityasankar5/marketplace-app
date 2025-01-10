import React, { useState } from "react";
import {
  Container,
  Paper,
  Typography,
  Box,
  Grid,
  Avatar,
  Divider,
  List,
  ListItem,
  ListItemText,
  Button,
  TextField,
  Alert,
  Chip,
} from "@mui/material";
import { useAuth } from "../context/AuthContext";
import { api } from "../services/api";

function Profile() {
  const { user, hasRole } = useAuth();
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({
    username: user?.username || "",
    email: user?.email || "",
  });
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const handleEdit = () => {
    setEditing(true);
    setError(null);
    setSuccess(null);
  };

  const handleCancel = () => {
    setEditing(false);
    setFormData({
      username: user?.username || "",
      email: user?.email || "",
    });
    setError(null);
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
      // Add API call here when backend supports profile update
      // await api.updateProfile(formData);
      setSuccess("Profile updated successfully");
      setEditing(false);
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Paper elevation={0} sx={{ p: 4, borderRadius: 2 }}>
        {/* Header */}
        <Box sx={{ display: "flex", alignItems: "center", mb: 4 }}>
          <Avatar
            sx={{
              width: 100,
              height: 100,
              bgcolor: "primary.main",
              fontSize: "2.5rem",
              mr: 3,
            }}
          >
            {user?.username?.[0]?.toUpperCase()}
          </Avatar>
          <Box>
            <Typography variant="h4" gutterBottom>
              {user?.username}
            </Typography>
            <Box sx={{ display: "flex", gap: 1 }}>
              {user?.roles?.map((role) => (
                <Chip
                  key={role}
                  label={role.charAt(0).toUpperCase() + role.slice(1)}
                  color={role === "seller" ? "primary" : "secondary"}
                  variant="outlined"
                  size="small"
                />
              ))}
            </Box>
          </Box>
        </Box>

        <Divider sx={{ my: 3 }} />

        {/* Profile Information */}
        {editing ? (
          <form onSubmit={handleSubmit}>
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Username"
                  name="username"
                  value={formData.username}
                  onChange={handleChange}
                  required
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </Grid>
            </Grid>

            {error && (
              <Alert severity="error" sx={{ mt: 2 }}>
                {error}
              </Alert>
            )}

            <Box sx={{ mt: 3, display: "flex", gap: 2 }}>
              <Button type="submit" variant="contained" color="primary">
                Save Changes
              </Button>
              <Button variant="outlined" onClick={handleCancel}>
                Cancel
              </Button>
            </Box>
          </form>
        ) : (
          <>
            <List>
              <ListItem>
                <ListItemText primary="Username" secondary={user?.username} />
              </ListItem>
              <ListItem>
                <ListItemText primary="Email" secondary={user?.email} />
              </ListItem>
              <ListItem>
                <ListItemText
                  primary="Account Type"
                  secondary={user?.roles?.join(", ").toUpperCase()}
                />
              </ListItem>
            </List>

            {success && (
              <Alert severity="success" sx={{ mt: 2 }}>
                {success}
              </Alert>
            )}

            <Box sx={{ mt: 3 }}>
              <Button variant="contained" color="primary" onClick={handleEdit}>
                Edit Profile
              </Button>
            </Box>
          </>
        )}

        {/* Statistics */}
        <Box sx={{ mt: 4 }}>
          <Typography variant="h6" gutterBottom>
            Activity
          </Typography>
          <Grid container spacing={3}>
            {hasRole("buyer") && (
              <Grid item xs={12} sm={6}>
                <Paper
                  elevation={0}
                  sx={{
                    p: 3,
                    textAlign: "center",
                    bgcolor: "action.hover",
                    borderRadius: 2,
                  }}
                >
                  <Typography variant="h4" color="primary">
                    0
                  </Typography>
                  <Typography variant="subtitle1">Orders Placed</Typography>
                </Paper>
              </Grid>
            )}
            {hasRole("seller") && (
              <Grid item xs={12} sm={6}>
                <Paper
                  elevation={0}
                  sx={{
                    p: 3,
                    textAlign: "center",
                    bgcolor: "action.hover",
                    borderRadius: 2,
                  }}
                >
                  <Typography variant="h4" color="primary">
                    0
                  </Typography>
                  <Typography variant="subtitle1">Products Listed</Typography>
                </Paper>
              </Grid>
            )}
          </Grid>
        </Box>
      </Paper>
    </Container>
  );
}

export default Profile;
