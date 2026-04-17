// Placeholder for authController.js
// Full implementation will be added later.
import User from "../models/User.js";
import jwt from "jsonwebtoken";

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "30d" });
};

export const registerUser = async (req, res) => {
  const { name, email, password } = req.body;

  const exists = await User.findOne({ email });
  if (exists) return res.status(400).json({ message: "Email already in use" });

  const user = await User.create({ name, email, password });

  const safeUser = user.toObject();
  delete safeUser.password;

  res.json({
    user: safeUser,
    token: generateToken(user._id),
  });
};

export const loginUser = async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });
  if (!user || !(await user.matchPassword(password)))
    return res.status(401).json({ message: "Invalid credentials" });

  const safeUser = user.toObject();
  delete safeUser.password;

  res.json({
    user: safeUser,
    token: generateToken(user._id),
  });
};
