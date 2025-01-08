const base = require("../config/airtable");

const orderController = {
  createOrder: async (req, res) => {
    try {
      const { productId, quantity } = req.body;

      // Get product details
      const product = await base("Products").find(productId);

      if (!product) {
        return res.status(404).json({ error: "Product not found" });
      }

      // Create order record
      const order = await base("Orders").create([
        {
          fields: {
            ProductId: productId,
            Quantity: quantity,
            Status: "Pending",
            CreatedAt: new Date().toISOString(),
          },
        },
      ]);

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
      const records = await base("Orders").select().all();
      const orders = records.map((record) => ({
        id: record.id,
        ...record.fields,
      }));
      res.json(orders);
    } catch (error) {
      console.error("Error fetching orders:", error);
      res.status(500).json({
        error: "Error fetching orders",
        details: error.message,
      });
    }
  },
};

module.exports = orderController;
