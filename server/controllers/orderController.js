const base = require("../config/airtable");

const orderController = {
  createOrder: async (req, res) => {
    try {
      const { productId, quantity, totalPrice } = req.body;
      const buyerId = req.user.id;

      // Get product details
      const product = await base("Products").find(productId);
      if (!product) {
        return res.status(404).json({ error: "Product not found" });
      }

      const sellerId = product.fields.SellerId;

      // Format date for Airtable
      const today = new Date().toISOString().split("T")[0];

      const orderData = {
        ProductId: productId,
        BuyerId: buyerId,
        SellerId: sellerId,
        Quantity: parseInt(quantity),
        TotalPrice: parseFloat(totalPrice),
        Status: "Pending",
        CreatedAt: today,
      };

      const record = await base("Orders").create([
        {
          fields: orderData,
        },
      ]);

      res.json(record);
    } catch (error) {
      console.error("Error creating order:", error);
      res.status(500).json({ error: "Error creating order" });
    }
  },

  getMyOrders: async (req, res) => {
    try {
      console.log("Request user:", req.user);
      console.log("Attempting to fetch orders for buyerId:", req.user.id);

      const records = await base("Orders")
        .select({
          filterByFormula: `BuyerId = '${req.user.id}'`,
          sort: [{ field: "CreatedAt", direction: "desc" }],
        })
        .all();

      console.log("Found orders:", records.length);

      const orders = await Promise.all(
        records.map(async (record) => {
          try {
            console.log("Processing order:", record.id);
            // Get product details
            let productName = "Product Name Unavailable";
            try {
              const product = await base("Products").find(
                record.fields.ProductId
              );
              if (product) {
                productName = product.fields.Name;
              }
            } catch (productError) {
              console.error("Error fetching product:", productError);
            }

            return {
              id: record.id,
              ProductId: record.fields.ProductId,
              ProductName: productName,
              Quantity: record.fields.Quantity,
              TotalPrice: record.fields.TotalPrice,
              Status: record.fields.Status,
              CreatedAt: record.fields.CreatedAt,
            };
          } catch (error) {
            console.error("Error processing individual order:", error);
            return null;
          }
        })
      );

      const validOrders = orders.filter((order) => order !== null);
      console.log("Sending back valid orders:", validOrders.length);

      res.json(validOrders);
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
      console.log("Request user:", req.user);
      console.log("Attempting to fetch orders for sellerId:", req.user.id);

      const records = await base("Orders")
        .select({
          filterByFormula: `SellerId = '${req.user.id}'`,
          sort: [{ field: "CreatedAt", direction: "desc" }],
        })
        .all();

      console.log("Found orders:", records.length);

      const orders = await Promise.all(
        records.map(async (record) => {
          try {
            console.log("Processing order:", record.id);

            // Get product details
            let productName = "Product Name Unavailable";
            try {
              const product = await base("Products").find(
                record.fields.ProductId
              );
              if (product) {
                productName = product.fields.Name;
              }
            } catch (productError) {
              console.error("Error fetching product:", productError);
            }

            // Get buyer details
            let buyerName = "Buyer Name Unavailable";
            try {
              const buyer = await base("Users").find(record.fields.BuyerId);
              if (buyer) {
                buyerName = buyer.fields.username;
              }
            } catch (buyerError) {
              console.error("Error fetching buyer:", buyerError);
            }

            return {
              id: record.id,
              ProductId: record.fields.ProductId,
              ProductName: productName,
              BuyerName: buyerName,
              Quantity: record.fields.Quantity,
              TotalPrice: record.fields.TotalPrice,
              Status: record.fields.Status,
              CreatedAt: record.fields.CreatedAt,
            };
          } catch (error) {
            console.error("Error processing individual order:", error);
            return null;
          }
        })
      );

      const validOrders = orders.filter((order) => order !== null);
      console.log("Sending back valid orders:", validOrders.length);

      res.json(validOrders);
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
