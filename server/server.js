const express = require("express");
const cors = require("cors");
require("dotenv").config();

// Add these lines to debug
console.log("Environment Variables Check:");
console.log("Access Token exists:", !!process.env.AIRTABLE_ACCESS_TOKEN);
console.log("Base ID exists:", !!process.env.AIRTABLE_BASE_ID);
console.log("PORT:", process.env.PORT);

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use("/api/products", require("./routes/products"));

// Basic test route
app.get("/test", (req, res) => {
  res.json({ message: "Server is running!" });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
