const express = require("express");
const cors = require("cors");
require("dotenv").config();

const app = express();

// CORS configuration
const allowedOrigins = [
  "https://marketplaceapp-f1mdmuvz8-adityasankar-senguptas-projects.vercel.app",
  "http://localhost:3000",
];

// Apply CORS before any routes
app.use(
  cors({
    origin: allowedOrigins,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    credentials: true,
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// Enable pre-flight requests for all routes
app.options("*", cors());

// Body parser middleware
app.use(express.json());

// Test route
app.get("/", (req, res) => {
  res.json({ message: "Marketplace API is running" });
});

// Routes
app.use("/api/auth", require("./routes/auth"));
app.use("/api/products", require("./routes/products"));
app.use("/api/orders", require("./routes/orders"));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
