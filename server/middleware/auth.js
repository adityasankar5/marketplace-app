const { verifyToken } = require("../config/auth");

exports.authenticate = (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];

    if (!token) {
      return res.status(401).json({ error: "No token provided" });
    }

    const decoded = verifyToken(token);
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ error: "Authentication failed" });
  }
};

exports.requireRole = (role) => {
  return (req, res, next) => {
    if (!req.user || !req.user.roles) {
      return res.status(403).json({ error: "Unauthorized" });
    }

    if (!req.user.roles.includes(role)) {
      return res.status(403).json({ error: "Insufficient permissions" });
    }
    next();
  };
};
