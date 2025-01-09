const base = require("../config/airtable");

const orderController = {
  // Create order
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

      const record = await base("Orders").create([
        {
          fields: {
            ProductId: productId,
            BuyerId: buyerId,
            SellerId: sellerId,
            Quantity: parseInt(quantity),
            TotalPrice: totalPrice,
            Status: "Pending",
            CreatedAt: new Date().toISOString(),
          },
        },
      ]);

      res.json(record);
    } catch (error) {
      console.error("Error creating order:", error);
      res.status(500).json({ error: "Error creating order" });
    }
  },

  // Get orders for buyer
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
      res.status(500).json({ error: "Error fetching orders" });
    }
  },

  // Get orders for seller
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
      res.status(500).json({ error: "Error fetching orders" });
    }
  },

  // Update order status
  updateOrderStatus: async (req, res) => {
    try {
      const { id } = req.params;
      const { status } = req.body;

      // Verify seller ownership
      const existingOrder = await base("Orders").find(id);
      if (existingOrder.fields.SellerId !== req.user.id) {
        return res
          .status(403)
          .json({ error: "Unauthorized to update this order" });
      }

      const record = await base("Orders").update([
        {
          id,
          fields: {
            Status: status,
          },
        },
      ]);

      res.json(record);
    } catch (error) {
      console.error("Error updating order:", error);
      res.status(500).json({ error: "Error updating order" });
    }
  },
};

module.exports = orderController;
