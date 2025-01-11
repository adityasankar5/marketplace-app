const express = require("express");
const router = express.Router();
const productController = require("../controllers/productController");
const { authenticate, requireRole } = require("../middleware/auth");

// Remove authentication from these routes completely
router.get("/", async (req, res) => {
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
