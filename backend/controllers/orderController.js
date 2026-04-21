import Order from "../models/Order.js";
import { ensureOrderReferences } from "../utils/orderReference.js";

function sanitizeItems(items = []) {
  return items
    .filter((item) => item && (item._id || item.id))
    .map((item) => ({
      _id: String(item._id || item.id),
      name: String(item.name || "Product"),
      price: Number(item.price ?? item.sale_price ?? 0),
      qty: Math.max(1, Number(item.qty ?? item.quantity ?? 1)),
      image: item.image || item.thumbnail || "",
      category: item.category ? String(item.category) : undefined,
      size: item.size ? String(item.size) : undefined,
      color: item.color ? String(item.color) : undefined,
    }));
}

function sanitizePayment(payment = {}) {
  if (!payment || !payment.method) {
    return {
      method: "Credit Card",
      status: "Pending",
    };
  }

  return {
    method: String(payment.method || "Credit Card"),
    status: String(payment.status || "Pending"),
    transactionId: payment.transactionId ? String(payment.transactionId) : undefined,
    last4: payment.last4 ? String(payment.last4).slice(-4) : undefined,
    brand: payment.brand ? String(payment.brand) : undefined,
    cardholderName: payment.cardholderName ? String(payment.cardholderName) : undefined,
    expMonth: payment.expMonth ? String(payment.expMonth) : undefined,
    expYear: payment.expYear ? String(payment.expYear) : undefined,
  };
}

export const createOrder = async (req, res, next) => {
  try {
    const {
      items,
      subtotal,
      shipping,
      discount,
      promoCode,
      total,
      shippingAddress,
      status,
      payment,
    } = req.body;

    const normalizedItems = sanitizeItems(items);

    if (!req.user?._id) {
      return res.status(401).json({ message: "Not authorized" });
    }

    if (normalizedItems.length === 0) {
      return res.status(400).json({ message: "Your cart is empty." });
    }

    const requiredShippingFields = ["fullName", "email", "phone", "address", "city", "state", "postalCode", "country"];
    const missingShippingField = requiredShippingFields.find(
      (field) => !String(shippingAddress?.[field] || "").trim()
    );

    if (missingShippingField) {
      return res.status(400).json({ message: "Please complete all required shipping details." });
    }

    const order = await Order.create({
      user: req.user._id,
      items: normalizedItems,
      subtotal: Number(subtotal || 0),
      shipping: Number(shipping || 0),
      discount: Number(discount || 0),
      promoCode: String(promoCode || "").trim().toUpperCase(),
      total: Number(total || 0),
      shippingAddress: {
        fullName: String(shippingAddress.fullName || "").trim(),
        email: String(shippingAddress.email || "").trim(),
        phone: String(shippingAddress.phone || "").trim(),
        address: String(shippingAddress.address || "").trim(),
        apartment: String(shippingAddress.apartment || "").trim(),
        city: String(shippingAddress.city || "").trim(),
        state: String(shippingAddress.state || "").trim(),
        postalCode: String(shippingAddress.postalCode || "").trim(),
        country: String(shippingAddress.country || "").trim(),
        notes: String(shippingAddress.notes || "").trim(),
      },
      payment: sanitizePayment(payment),
      status: status || "Pending",
    });

    res.status(201).json(order);
  } catch (error) {
    next(error);
  }
};

export const getMyOrders = async (req, res, next) => {
  try {
    const orders = await Order.find({ user: req.user._id }).sort({ createdAt: -1 });
    await ensureOrderReferences(Order, orders);
    res.json(orders);
  } catch (error) {
    next(error);
  }
};

export const adminGetOrders = async (req, res, next) => {
  try {
    const orders = await Order.find().populate("user", "name email").sort({ createdAt: -1 });
    await ensureOrderReferences(Order, orders);
    res.json(orders);
  } catch (error) {
    next(error);
  }
};

export const updateOrderStatus = async (req, res, next) => {
  try {
    const { status } = req.body;
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    order.status = status || order.status;
    await order.save();
    res.json(order);
  } catch (error) {
    next(error);
  }
};
