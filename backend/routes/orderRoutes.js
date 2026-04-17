// Placeholder for orderRoutes.js
// Full implementation will be added later.
import express from "express";
import {
  createOrder,
  getMyOrders,
  adminGetOrders,
  updateOrderStatus,
} from "../controllers/orderController.js";

import { protect, admin } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/", protect, createOrder);
router.get("/my", protect, getMyOrders);
router.get("/", protect, admin, adminGetOrders);
router.put("/:id", protect, admin, updateOrderStatus);

export default router;
