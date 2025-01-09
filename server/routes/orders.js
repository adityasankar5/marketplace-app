const express = require("express");
const router = express.Router();
const orderController = require("../controllers/orderController");
const { authenticate, requireRole } = require("../middleware/auth");

router.use(authenticate); // All order routes require authentication

router.post("/", requireRole("buyer"), orderController.createOrder);
router.get("/my-orders", requireRole("buyer"), orderController.getMyOrders);
router.get(
  "/received-orders",
  requireRole("seller"),
  orderController.getReceivedOrders
);
router.patch(
  "/:id/status",
  requireRole("seller"),
  orderController.updateOrderStatus
);

module.exports = router;
