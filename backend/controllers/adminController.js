import User from "../models/User.js";
import Product from "../models/Product.js";
import Order from "../models/Order.js";

// Simple dashboard stats for admin overview.
export const getStats = async (req, res) => {
  const [users, products, orders] = await Promise.all([
    User.countDocuments(),
    Product.countDocuments(),
    Order.countDocuments(),
  ]);

  res.json({ users, products, orders });
};
