// Placeholder for productController.js
// Full implementation will be added later.
import Product from "../models/Product.js";

export const getProducts = async (req, res) => {
  const { category, sort, minPrice, maxPrice, search } = req.query;

  let query = {};

  if (category) query.category = category;
  if (search) {
    query.$or = [
      { name: { $regex: search, $options: "i" } },
      { description: { $regex: search, $options: "i" } },
    ];
  }
  if (minPrice || maxPrice) {
    query.price = {};
    if (minPrice) query.price.$gte = Number(minPrice);
    if (maxPrice) query.price.$lte = Number(maxPrice);
  }

  let products = await Product.find(query);

  if (sort === "low-high") products = products.sort((a, b) => a.price - b.price);
  if (sort === "high-low") products = products.sort((a, b) => b.price - a.price);

  res.json(products);
};

export const getProduct = async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (!product) return res.status(404).json({ message: "Not found" });
  res.json(product);
};

export const createProduct = async (req, res) => {
  const p = await Product.create(req.body);
  res.json(p);
};

export const updateProduct = async (req, res) => {
  const p = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.json(p);
};

export const deleteProduct = async (req, res) => {
  await Product.findByIdAndDelete(req.params.id);
  res.json({ message: "Product removed" });
};
