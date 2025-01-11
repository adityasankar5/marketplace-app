const base = require("../config/airtable");

const productController = {
  // Get all products
  getAllProducts: async (req, res) => {
    try {
      const records = await base("Products").select().all();
      const products = records.map((record) => ({
        id: record.id,
        Name: record.fields.Name,
        Description: record.fields.Description,
        Price: record.fields.Price,
        ImageUrl: record.fields.ImageUrl,
        SellerId: record.fields.SellerId,
      }));
      res.json(products);
    } catch (error) {
      console.error("Error fetching products:", error);
      res.status(500).json({ error: "Error fetching products" });
    }
  },

  // Get product by ID
  getProductById: async (req, res) => {
    try {
      const { id } = req.params;
      const record = await base("Products").find(id);

      if (!record) {
        return res.status(404).json({ error: "Product not found" });
      }

      const product = {
        id: record.id,
        Name: record.fields.Name,
        Description: record.fields.Description,
        Price: record.fields.Price,
        ImageUrl: record.fields.ImageUrl,
        SellerId: record.fields.SellerId,
        CreatedAt: record.fields.CreatedAt,
      };

      res.json(product);
    } catch (error) {
      console.error("Error fetching product:", error);
      res.status(500).json({ error: "Error fetching product" });
    }
  },

  // Create product
  createProduct: async (req, res) => {
    try {
      // Log incoming data
      console.log("Request body:", req.body);
      console.log("User data:", req.user);

      const { Name, Description, Price, ImageUrl } = req.body;
      const SellerId = req.user.id;

      // Log the data we're about to send to Airtable
      const productData = {
        Name,
        Description,
        Price: parseFloat(Price),
        ImageUrl,
        SellerId,
        CreatedAt: new Date().toISOString().split("T")[0],
      };

      console.log("Attempting to create product with data:", productData);

      // Try to create the record
      try {
        const record = await base("Products").create([
          {
            fields: productData,
          },
        ]);
        console.log("Product created successfully:", record);
        res.json(record);
      } catch (airtableError) {
        console.error("Airtable Error:", {
          message: airtableError.message,
          error: airtableError.error,
          statusCode: airtableError.statusCode,
          stack: airtableError.stack,
        });
        throw airtableError;
      }
    } catch (error) {
      console.error("Full error details:", {
        message: error.message,
        error: error.error,
        statusCode: error.statusCode,
        stack: error.stack,
      });
      res.status(500).json({
        error: "Error creating product",
        details: error.message,
        fullError: error,
      });
    }
  },

  // Update product
  updateProduct: async (req, res) => {
    try {
      const { id } = req.params;
      const { Name, Description, Price, ImageUrl } = req.body;

      // Verify ownership
      const existingProduct = await base("Products").find(id);
      if (existingProduct.fields.SellerId !== req.user.id) {
        return res
          .status(403)
          .json({ error: "Unauthorized to update this product" });
      }

      const record = await base("Products").update([
        {
          id,
          fields: {
            Name,
            Description,
            Price: parseFloat(Price),
            ImageUrl,
          },
        },
      ]);

      res.json(record);
    } catch (error) {
      console.error("Error updating product:", error);
      res.status(500).json({ error: "Error updating product" });
    }
  },

  // Delete product
  deleteProduct: async (req, res) => {
    try {
      const { id } = req.params;

      // Verify ownership
      const existingProduct = await base("Products").find(id);
      if (existingProduct.fields.SellerId !== req.user.id) {
        return res
          .status(403)
          .json({ error: "Unauthorized to delete this product" });
      }

      await base("Products").destroy([id]);
      res.json({ message: "Product deleted successfully" });
    } catch (error) {
      console.error("Error deleting product:", error);
      res.status(500).json({ error: "Error deleting product" });
    }
  },
};

module.exports = productController;
