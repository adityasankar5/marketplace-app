import React, { useState, useEffect } from "react";
import {
  Container,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  Chip,
  CircularProgress,
  Alert,
  Tabs,
  Tab,
  Box,
  Select,
  MenuItem,
  FormControl,
} from "@mui/material";
import { useAuth } from "../context/AuthContext";
import { api } from "../services/api";

function Orders() {
  const { user, hasRole } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState(0);

  useEffect(() => {
    fetchOrders();
  }, [activeTab]);

  const fetchOrders = async () => {
    try {
      const response =
        activeTab === 0
          ? await api.getMyOrders()
          : await api.getReceivedOrders();
      setOrders(response.data);
      setLoading(false);
    } catch (err) {
      setError("Error fetching orders");
      setLoading(false);
    }
  };

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      await api.updateOrderStatus(orderId, newStatus);
      fetchOrders();
    } catch (err) {
      setError("Error updating order status");
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "Completed":
        return "success";
      case "Pending":
        return "warning";
      case "Cancelled":
        return "error";
      default:
        return "default";
    }
  };

  if (loading) return <CircularProgress />;
  if (error) return <Alert severity="error">{error}</Alert>;

  return (
    <Container maxWidth="lg">
      <Typography variant="h4" gutterBottom sx={{ mt: 4 }}>
        Orders
      </Typography>

      {hasRole("buyer") && hasRole("seller") && (
        <Tabs
          value={activeTab}
          onChange={(e, newValue) => setActiveTab(newValue)}
          sx={{ mb: 3 }}
        >
          <Tab label="My Orders" />
          <Tab label="Received Orders" />
        </Tabs>
      )}

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Order ID</TableCell>
              <TableCell>Product</TableCell>
              <TableCell>Quantity</TableCell>
              <TableCell>Total Price</TableCell>
              <TableCell>Date</TableCell>
              <TableCell>Status</TableCell>
              {activeTab === 1 && <TableCell>Buyer</TableCell>}
              {activeTab === 1 && <TableCell>Actions</TableCell>}
            </TableRow>
          </TableHead>
          <TableBody>
            {orders.map((order) => (
              <TableRow key={order.id}>
                <TableCell>{order.id}</TableCell>
                <TableCell>{order.ProductName}</TableCell>
                <TableCell>{order.Quantity}</TableCell>
                <TableCell>${order.TotalPrice}</TableCell>
                <TableCell>
                  {new Date(order.CreatedAt).toLocaleDateString()}
                </TableCell>
                <TableCell>
                  <Chip
                    label={order.Status}
                    color={getStatusColor(order.Status)}
                    size="small"
                  />
                </TableCell>
                {activeTab === 1 && <TableCell>{order.BuyerName}</TableCell>}
                {activeTab === 1 && (
                  <TableCell>
                    <FormControl size="small">
                      <Select
                        value={order.Status}
                        onChange={(e) =>
                          handleStatusChange(order.id, e.target.value)
                        }
                        sx={{ minWidth: 120 }}
                      >
                        <MenuItem value="Pending">Pending</MenuItem>
                        <MenuItem value="Completed">Completed</MenuItem>
                        <MenuItem value="Cancelled">Cancelled</MenuItem>
                      </Select>
                    </FormControl>
                  </TableCell>
                )}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Container>
  );
}

export default Orders;
