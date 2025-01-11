const express = require("express");
const cors = require("cors");
require("dotenv").config();
const base = require("./config/airtable");

const app = express();

// CORS configuration with wildcard for .vercel.app domains
app.use(
  cors({
    origin: function (origin, callback) {
      // allow requests with no origin (like mobile apps or curl requests)
      if (!origin) return callback(null, true);

      // allow all vercel.app domains and localhost
      if (
        origin.endsWith(".vercel.app") ||
        origin === "http://localhost:3000"
      ) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// Body parser middleware
app.use(express.json());

// Public routes
app.get("/products", async (req, res) => {
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
});

// Get single product
app.get("/products/:id", async (req, res) => {
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
    };

    res.json(product);
  } catch (error) {
    console.error("Error fetching product:", error);
    if (error.error === "NOT_FOUND") {
      res.status(404).json({ error: "Product not found" });
    } else {
      res.status(500).json({ error: "Error fetching product" });
    }
  }
});

// Protected routes
app.use("/api/auth", require("./routes/auth"));
app.use("/api/orders", require("./routes/orders"));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
