// Placeholder for userRoutes.js
// Full implementation will be added later.
import express from "express";
import { getProfile, getAllUsers } from "../controllers/userController.js";
import { protect, admin } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/profile", protect, getProfile);
router.get("/", protect, admin, getAllUsers);

export default router;