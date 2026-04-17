// Placeholder for Order.js
// Full implementation will be added later.
import mongoose from "mongoose";
import { assignOrderReference } from "../utils/orderReference.js";

const orderSchema = mongoose.Schema(
  {
    orderReference: {
      type: String,
      unique: true,
      index: true,
      sparse: true,
    },
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    items: [
      {
        _id: String,
        name: String,
        price: Number,
        qty: Number,
        image: String
      }
    ],
    subtotal: Number,
    shipping: Number,
    discount: Number,
    promoCode: String,
    total: Number,
    status: { type: String, default: "Pending" },
    shippingAddress: {
      fullName: String,
      email: String,
      phone: String,
      address: String,
      apartment: String,
      city: String,
      state: String,
      postalCode: String,
      country: String,
      notes: String,
    },
  },
  { timestamps: true }
);

orderSchema.pre("validate", async function preValidate(next) {
  try {
    await assignOrderReference(this.constructor, this);
    next();
  } catch (error) {
    next(error);
  }
});

export default mongoose.model("Order", orderSchema);
