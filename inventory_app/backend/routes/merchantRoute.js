import express from "express";
import {
  registerMerchant,
  loginMerchant,
  logoutMerchant,
  getAllMerchants,
  getMerchantById,
} from "../controllers/merchantController.js";

const router = express.Router();

// Register a new merchant
router.post("/register", registerMerchant);

// Login merchant
router.post("/login", loginMerchant);

// Logout merchant
router.post("/logout", logoutMerchant);

// Get all merchants
router.get("/", getAllMerchants);

// Get merchant by ID
router.get("/:id", getMerchantById);

export default router;
