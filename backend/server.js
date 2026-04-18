import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import connectDB from "./config/db.js";

import authRoutes from "./routes/authRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import productRoutes from "./routes/productRoutes.js";
import orderRoutes from "./routes/orderRoutes.js";
import paymentRoutes from "./routes/paymentRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";

import { notFound, errorHandler } from "./middleware/errorMiddleware.js";

dotenv.config();
connectDB();

const app = express();

const configuredOrigins = [
  process.env.FRONTEND_URL,
  ...(process.env.ALLOWED_ORIGINS || "").split(","),
]
  .map((origin) => String(origin || "").trim().replace(/\/+$/, ""))
  .filter(Boolean);

function isAllowedOrigin(origin) {
  if (!origin) return true;

  const normalizedOrigin = String(origin).replace(/\/+$/, "");
  if (normalizedOrigin.includes("localhost") || normalizedOrigin.includes("vercel.app")) {
    return true;
  }

  return configuredOrigins.includes(normalizedOrigin);
}

const corsOptions = {
  origin(origin, callback) {
    if (isAllowedOrigin(origin)) {
      callback(null, true);
      return;
    }
    callback(new Error("Not allowed by CORS"));
  },
  credentials: true,
};

app.use(cors(corsOptions));
app.options("*", cors(corsOptions));
app.use(express.json());
app.use(cookieParser());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/products", productRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/payment", paymentRoutes);
app.use("/api/admin", adminRoutes);

// Errors
app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5001;
app.listen(PORT, console.log(`Server running on port ${PORT}`));
