// Placeholder for userController.js
// Full implementation will be added later.
import User from "../models/User.js";

export const getProfile = async (req, res) => {
  res.json(req.user);
};

export const getAllUsers = async (req, res) => {
  const users = await User.find().select("-password");
  res.json(users);
};
