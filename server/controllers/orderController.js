const base = require("../config/airtable");

const orderController = {
  createOrder: async (req, res) => {
    try {
      const { productId, quantity } = req.body;
      const buyerId = req.user.id;

      // Get product details
      const product = await base("Products").find(productId);
      if (!product) {
        return res.status(404).json({ error: "Product not found" });
      }

      const totalPrice = product.fields.Price * quantity;
      const sellerId = product.fields.SellerId;

      // Format date for Airtable
      const today = new Date().toISOString().split("T")[0];

      const orderData = {
        ProductId: productId,
        BuyerId: buyerId,
        SellerId: sellerId,
        Quantity: parseInt(quantity),
        TotalPrice: parseFloat(totalPrice.toFixed(2)),
        Status: "Pending",
        CreatedAt: today,
      };

      console.log("Creating order with data:", orderData);

      const record = await base("Orders").create([
        {
          fields: orderData,
        },
      ]);

      res.json(record);
    } catch (error) {
      console.error("Error creating order:", error);
      res.status(500).json({
        error: "Error creating order",
        details: error.message,
      });
    }
  },

  getMyOrders: async (req, res) => {
    try {
      const records = await base("Orders")
        .select({
          filterByFormula: `BuyerId = '${req.user.id}'`,
          sort: [{ field: "CreatedAt", direction: "desc" }],
        })
        .all();

      const orders = await Promise.all(
        records.map(async (record) => {
          const product = await base("Products").find(record.fields.ProductId);
          return {
            id: record.id,
            ProductId: record.fields.ProductId,
            ProductName: product.fields.Name,
            Quantity: record.fields.Quantity,
            TotalPrice: record.fields.TotalPrice,
            Status: record.fields.Status,
            CreatedAt: record.fields.CreatedAt,
          };
        })
      );

      res.json(orders);
    } catch (error) {
      console.error("Error fetching orders:", error);
      res.status(500).json({
        error: "Error fetching orders",
        details: error.message,
      });
    }
  },

  getReceivedOrders: async (req, res) => {
    try {
      const records = await base("Orders")
        .select({
          filterByFormula: `SellerId = '${req.user.id}'`,
          sort: [{ field: "CreatedAt", direction: "desc" }],
        })
        .all();

      const orders = await Promise.all(
        records.map(async (record) => {
          const product = await base("Products").find(record.fields.ProductId);
          const buyer = await base("Users").find(record.fields.BuyerId);
          return {
            id: record.id,
            ProductId: record.fields.ProductId,
            ProductName: product.fields.Name,
            BuyerId: record.fields.BuyerId,
            BuyerName: buyer.fields.username,
            Quantity: record.fields.Quantity,
            TotalPrice: record.fields.TotalPrice,
            Status: record.fields.Status,
            CreatedAt: record.fields.CreatedAt,
          };
        })
      );

      res.json(orders);
    } catch (error) {
      console.error("Error fetching orders:", error);
      res.status(500).json({
        error: "Error fetching orders",
        details: error.message,
      });
    }
  },
  updateOrderStatus: async (req, res) => {
    try {
      const { id } = req.params;
      const { status } = req.body;

      // Validate status
      const validStatuses = ["Pending", "Completed", "Cancelled"];
      if (!validStatuses.includes(status)) {
        return res.status(400).json({
          error: "Invalid status",
          details: "Status must be Pending, Completed, or Cancelled",
        });
      }

      // Get the order to verify seller
      const order = await base("Orders").find(id);

      if (!order) {
        return res.status(404).json({ error: "Order not found" });
      }

      // Verify that the user is the seller of this order
      if (order.fields.SellerId !== req.user.id) {
        return res
          .status(403)
          .json({ error: "Unauthorized to update this order" });
      }

      // Update the order status
      const updatedOrder = await base("Orders").update([
        {
          id: id,
          fields: {
            Status: status,
          },
        },
      ]);

      res.json(updatedOrder);
    } catch (error) {
      console.error("Error updating order status:", error);
      res.status(500).json({
        error: "Error updating order status",
        details: error.message,
      });
    }
  },
};

module.exports = orderController;
