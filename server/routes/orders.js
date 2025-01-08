const express = require("express");
const router = express.Router();
const orderController = require("../controllers/orderController");

// Order routes
router.post("/", orderController.createOrder);
router.get("/", orderController.getOrders);
router.patch("/:id/status", orderController.updateOrderStatus);

module.exports = router;
