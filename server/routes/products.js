const express = require("express");
const router = express.Router();
const productController = require("../controllers/productController");
const { authenticate, requireRole } = require("../middleware/auth");

// Public routes
router.get("/", productController.getAllProducts);
router.get("/:id", productController.getProductById);

// Protected routes
router.post(
  "/",
  authenticate,
  requireRole("seller"),
  productController.createProduct
);
router.put(
  "/:id",
  authenticate,
  requireRole("seller"),
  productController.updateProduct
);
router.delete(
  "/:id",
  authenticate,
  requireRole("seller"),
  productController.deleteProduct
);

module.exports = router;
