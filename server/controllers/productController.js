const base = require("../config/airtable");

const productController = {
  // Get all products
  getAllProducts: async (req, res) => {
    try {
      console.log("Fetching products...");
      const records = await base("Products").select().all();
      const products = records.map((record) => ({
        id: record.id,
        ...record.fields,
      }));
      console.log(`Successfully fetched ${products.length} products`);
      res.json(products);
    } catch (error) {
      console.error("Error fetching products:", error);
      res.status(500).json({
        error: "Error fetching products",
        details: error.message,
      });
    }
  },

  // Create a product
  createProduct: async (req, res) => {
    try {
      const { Name, Description, Price, ImageUrl, SellerId } = req.body;

      // Convert Price to number and validate
      const numericPrice = Number(Price);
      if (isNaN(numericPrice)) {
        return res.status(400).json({
          error: "Invalid price format",
        });
      }

      const productData = {
        fields: {
          Name,
          Description,
          Price: numericPrice, // Send as number
          ImageUrl,
          SellerId,
        },
      };

      console.log("Creating new product:", productData);

      const record = await base("Products").create([productData]);
      console.log("Product created successfully");
      res.json(record);
    } catch (error) {
      console.error("Error creating product:", error);
      res.status(500).json({
        error: "Error creating product",
        details: error.message,
      });
    }
  },
  getProductById: async (req, res) => {
    try {
      const { id } = req.params;
      const record = await base("Products").find(id);

      if (!record) {
        return res.status(404).json({ error: "Product not found" });
      }

      const product = {
        id: record.id,
        ...record.fields,
      };

      res.json(product);
    } catch (error) {
      console.error("Error fetching product:", error);
      res.status(500).json({
        error: "Error fetching product",
        details: error.message,
      });
    }
  },
};

module.exports = productController;
