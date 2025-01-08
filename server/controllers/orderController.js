const base = require("../config/airtable");

const orderController = {
  createOrder: async (req, res) => {
    try {
      console.log("Creating order with data:", req.body);
      const { productId, quantity, status, createdAt, totalPrice } = req.body;

      // Validate required fields
      if (!productId || !quantity || !status || !createdAt || !totalPrice) {
        return res.status(400).json({
          error: "Missing required fields",
          details:
            "All fields are required: productId, quantity, status, createdAt, totalPrice",
        });
      }

      // Create order record with all fields
      const orderFields = {
        ProductId: productId,
        Quantity: parseInt(quantity),
        Status: status,
        CreatedAt: createdAt,
        TotalPrice: parseFloat(totalPrice),
      };

      console.log("Creating order with fields:", orderFields);

      const order = await base("Orders").create([
        {
          fields: orderFields,
        },
      ]);

      console.log("Order created successfully:", order);
      res.json(order);
    } catch (error) {
      console.error("Error creating order:", error);
      res.status(500).json({
        error: "Error creating order",
        details: error.message,
      });
    }
  },

  getOrders: async (req, res) => {
    try {
      console.log("Fetching orders...");
      const records = await base("Orders")
        .select({
          sort: [{ field: "CreatedAt", direction: "desc" }],
        })
        .all();

      // Map the records to include all necessary fields
      const orders = records.map((record) => ({
        id: record.id,
        productId: record.fields.ProductId,
        quantity: record.fields.Quantity,
        status: record.fields.Status,
        createdAt: record.fields.CreatedAt,
        totalPrice: record.fields.TotalPrice,
      }));

      console.log("Successfully fetched orders:", orders.length);
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

      if (!["Pending", "Completed", "Cancelled"].includes(status)) {
        return res.status(400).json({
          error: "Invalid status",
          details: "Status must be Pending, Completed, or Cancelled",
        });
      }

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
