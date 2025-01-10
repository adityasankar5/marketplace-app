const jwt = require("jsonwebtoken");
require("dotenv").config();

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key";

module.exports = {
  generateToken: (userData) => {
    return jwt.sign(userData, JWT_SECRET, { expiresIn: "24h" });
  },

  verifyToken: (token) => {
    return jwt.verify(token, JWT_SECRET);
  },
};
