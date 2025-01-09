const jwt = require("jsonwebtoken");
require("dotenv").config();

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key";

module.exports = {
  generateToken: (userData) => {
    return jwt.sign(userData, JWT_SECRET, { expiresIn: "24h" });
  },

  verifyToken: (req, res, next) => {
    try {
      const token = req.headers.authorization?.split(" ")[1];

      if (!token) {
        return res.status(401).json({ error: "No token provided" });
      }

      jwt.verify(token, JWT_SECRET, (err, decoded) => {
        if (err) {
          return res.status(401).json({ error: "Invalid token" });
        }

        // Add decoded user to request
        req.user = decoded;
        next();
      });
    } catch (error) {
      return res.status(401).json({ error: "Authentication failed" });
    }
  },
};
