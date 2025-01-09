import React, { useState } from "react";
import {
  Container,
  Paper,
  TextField,
  Button,
  Typography,
  Alert,
  Box,
  FormGroup,
  FormControlLabel,
  Checkbox,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { api } from "../../services/api";

function Register() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    roles: [],
  });
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleRoleChange = (e) => {
    const { checked, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      roles: checked
        ? [...prev.roles, value]
        : prev.roles.filter((role) => role !== value),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.roles.length === 0) {
      setError("Please select at least one role");
      return;
    }
    try {
      const response = await api.register(formData);
      login(response.data.token, response.data.user);
      navigate("/");
    } catch (err) {
      setError(err.response?.data?.error || "Error registering");
    }
  };

  return (
    <Container maxWidth="sm">
      <Paper elevation={3} sx={{ p: 4, mt: 4 }}>
        <Typography variant="h5" gutterBottom>
          Register
        </Typography>
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}
        <Box component="form" onSubmit={handleSubmit}>
          <TextField
            fullWidth
            label="Username"
            name="username"
            value={formData.username}
            onChange={handleChange}
            margin="normal"
            required
          />
          <TextField
            fullWidth
            label="Email"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            margin="normal"
            required
          />
          <TextField
            fullWidth
            label="Password"
            name="password"
            type="password"
            value={formData.password}
            onChange={handleChange}
            margin="normal"
            required
          />
          <FormGroup>
            <Typography variant="subtitle1" sx={{ mt: 2 }}>
              Select Role(s):
            </Typography>
            <FormControlLabel
              control={
                <Checkbox
                  checked={formData.roles.includes("buyer")}
                  onChange={handleRoleChange}
                  value="buyer"
                />
              }
              label="Buyer"
            />
            <FormControlLabel
              control={
                <Checkbox
                  checked={formData.roles.includes("seller")}
                  onChange={handleRoleChange}
                  value="seller"
                />
              }
              label="Seller"
            />
          </FormGroup>
          <Button
            type="submit"
            variant="contained"
            color="primary"
            fullWidth
            sx={{ mt: 2 }}
          >
            Register
          </Button>
          <Button
            variant="text"
            fullWidth
            sx={{ mt: 1 }}
            onClick={() => navigate("/login")}
          >
            Already have an account? Login
          </Button>
        </Box>
      </Paper>
    </Container>
  );
}

export default Register;
