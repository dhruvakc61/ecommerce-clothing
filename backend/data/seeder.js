// Placeholder for seeder.js
// Full implementation will be added later.
import mongoose from "mongoose";
import dotenv from "dotenv";
import Product from "../models/Product.js";

dotenv.config();

const products = [
  {
    name: "Men's Jacket",
    price: 59.99,
    category: "men",
    image: "https://via.placeholder.com/400",
    description: "Warm men's jacket."
  },
  {
    name: "Women's Hoodie",
    price: 39.99,
    category: "women",
    image: "https://via.placeholder.com/400",
    description: "Comfortable women's hoodie."
  }
];

mongoose
  .connect(process.env.MONGO_URI)
  .then(async () => {
    await Product.deleteMany();
    await Product.insertMany(products);
    console.log("✅ Sample data inserted");
    process.exit();
  })
  .catch((err) => console.error(err));