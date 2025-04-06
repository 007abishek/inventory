import express from "express";
import {
  createProduct,
  getMerchantProducts,
  getCustomerProducts,
  getAllProducts,
  getProductById,
  deleteProduct,
  updateProduct,
  shopProducts, // Added the shopProducts controller
} from "../controllers/productController.js";
import { protectMerchant, protectWorker } from "../middleware/authMiddleware.js";

const router = express.Router();

// Route to create a new product (merchant only)
router.post("/", protectMerchant, createProduct);

// Route to get all products for the merchant (merchant only)
router.get("/merchant", protectMerchant, getMerchantProducts);

// Route to get all available products for customers (no authentication required)
router.get("/customer", getCustomerProducts);

// Route to get all products (admin or authorized users)
router.get("/", getAllProducts);

// Route to get a single product by ID (public access)
router.get("/:id", getProductById);

// Route to delete a product (merchant only)
router.delete("/:id", protectMerchant, deleteProduct);

// Route to update a product (merchant only)
router.patch("/:id", protectMerchant, updateProduct);

// Route to get products based on the worker's shopKey (worker only)
router.get("/shop/:workerId", protectWorker, shopProducts); // Added this route

export default router;
