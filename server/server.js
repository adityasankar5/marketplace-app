const express = require("express");
const cors = require("cors");
require("dotenv").config();

const app = express();

// CORS configuration
app.use(
  cors({
    origin: "*", // Allow all origins for now
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// Enable pre-flight for all routes
app.options("*", cors());

app.use(express.json());

// Test route
app.get("/", (req, res) => {
  res.json({ message: "API is running" });
});

// Routes
app.use("/products", require("./routes/products")); // Remove /api prefix for now
app.use("/api/auth", require("./routes/auth"));
app.use("/api/orders", require("./routes/orders"));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
