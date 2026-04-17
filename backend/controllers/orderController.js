// Placeholder for orderController.js
// Full implementation will be added later.
import Order from "../models/Order.js";
import { ensureOrderReferences } from "../utils/orderReference.js";

export const createOrder = async (req, res) => {
  const { items, subtotal, shipping, discount, promoCode, total, shippingAddress, status } = req.body;

  const order = await Order.create({
    user: req.user._id,
    items,
    subtotal,
    shipping,
    discount,
    promoCode,
    total,
    shippingAddress,
    status: status || "Pending",
  });

  res.json(order);
};

export const getMyOrders = async (req, res) => {
  const orders = await Order.find({ user: req.user._id });
  await ensureOrderReferences(Order, orders);
  res.json(orders);
};

export const adminGetOrders = async (req, res) => {
  const orders = await Order.find().populate("user", "name email");
  await ensureOrderReferences(Order, orders);
  res.json(orders);
};

// Admin-only status update for simple fulfillment workflow.
export const updateOrderStatus = async (req, res) => {
  const { status } = req.body;
  const order = await Order.findById(req.params.id);
  if (!order) return res.status(404).json({ message: "Order not found" });
  order.status = status || order.status;
  await order.save();
  res.json(order);
};
