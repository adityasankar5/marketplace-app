const { verifyToken } = require("../config/auth");

exports.authenticate = (req, res, next) => {
  verifyToken(req, res, next);
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
