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
  Box,
  Tabs,
  Tab,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  TextField,
  InputAdornment,
} from "@mui/material";
import { Search as SearchIcon } from "@mui/icons-material";
import { useAuth } from "../context/AuthContext";
import { api } from "../services/api";
import Loading from "./common/Loading";
import ErrorDisplay from "./common/ErrorDisplay";
import Notification from "./common/Notification";

function Orders() {
  const { user, hasRole } = useAuth();
  const [activeTab, setActiveTab] = useState(0);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [statusFilter, setStatusFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [notification, setNotification] = useState({
    open: false,
    message: "",
    type: "success",
  });

  useEffect(() => {
    fetchOrders();
  }, [activeTab]);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await (activeTab === 0
        ? api.getMyOrders()
        : api.getReceivedOrders());
      console.log("Orders response:", response); // Add this for debugging
      setOrders(response.data || []);
    } catch (err) {
      console.error("Error details:", err); // Add this for debugging
      setError("Failed to fetch orders");
    } finally {
      setLoading(false);
    }
  };
  const handleStatusChange = async (orderId, newStatus) => {
    try {
      await api.updateOrderStatus(orderId, newStatus);
      setNotification({
        open: true,
        message: "Order status updated successfully",
        type: "success",
      });
      fetchOrders();
    } catch (err) {
      setNotification({
        open: true,
        message: "Failed to update order status",
        type: "error",
      });
    }
  };

  const filteredOrders = orders.filter((order) => {
    const matchesStatus =
      statusFilter === "all" || order.Status === statusFilter;
    const searchLower = searchTerm.toLowerCase();
    const matchesSearch =
      order.ProductName?.toLowerCase().includes(searchLower) ||
      order.id?.toLowerCase().includes(searchLower);
    return matchesStatus && matchesSearch;
  });

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

  if (loading) return <Loading message="Loading orders..." />;
  if (error) return <ErrorDisplay error={error} onRetry={fetchOrders} />;

  return (
    <Container maxWidth="lg" sx={{ mt: 4 }}>
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

      <Box sx={{ mb: 3, display: "flex", gap: 2 }}>
        <TextField
          placeholder="Search orders..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
          sx={{ flexGrow: 1 }}
        />

        <FormControl sx={{ minWidth: 120 }}>
          <InputLabel>Status</InputLabel>
          <Select
            value={statusFilter}
            label="Status"
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <MenuItem value="all">All</MenuItem>
            <MenuItem value="Pending">Pending</MenuItem>
            <MenuItem value="Completed">Completed</MenuItem>
            <MenuItem value="Cancelled">Cancelled</MenuItem>
          </Select>
        </FormControl>
      </Box>

      {filteredOrders.length === 0 ? (
        <Typography
          variant="h6"
          color="text.secondary"
          align="center"
          sx={{ mt: 4 }}
        >
          No orders found
        </Typography>
      ) : (
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
              {filteredOrders.map((order) => (
                <TableRow key={order.id}>
                  <TableCell>{order.id}</TableCell>
                  <TableCell>{order.ProductName}</TableCell>
                  <TableCell>{order.Quantity}</TableCell>
                  <TableCell>${order.TotalPrice.toFixed(2)}</TableCell>
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
                      <Select
                        value={order.Status}
                        size="small"
                        onChange={(e) =>
                          handleStatusChange(order.id, e.target.value)
                        }
                        sx={{ minWidth: 120 }}
                      >
                        <MenuItem value="Pending">Pending</MenuItem>
                        <MenuItem value="Completed">Completed</MenuItem>
                        <MenuItem value="Cancelled">Cancelled</MenuItem>
                      </Select>
                    </TableCell>
                  )}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      <Notification
        open={notification.open}
        message={notification.message}
        type={notification.type}
        onClose={() => setNotification((prev) => ({ ...prev, open: false }))}
      />
    </Container>
  );
}

export default Orders;
