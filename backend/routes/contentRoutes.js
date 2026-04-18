import express from "express";
import { getVogueArticles } from "../controllers/contentController.js";

const router = express.Router();

router.get("/vogue", getVogueArticles);

export default router;
