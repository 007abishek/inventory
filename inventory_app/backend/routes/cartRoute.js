import express from "express";
import { addToCart, removeFromCart, getCart } from "../controllers/cartcontroller.js";
import { protectWorker } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/add", protectWorker, addToCart);
router.post("/remove", protectWorker, removeFromCart);
router.get("/get", protectWorker, getCart);

export default router;
