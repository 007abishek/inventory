import Product from '../models/productModel.js';
import Merchant from '../models/merchantModel.js';
import Worker from "../models/workerModel.js";


export const createProduct = async (req, res) => {
  const { name, category, quantity, price, description } = req.body;

  if (!name || !category || !quantity || !price || !description) {
    return res.status(400).json({ message: "All fields are required" });
  }

  try {
    const merchantId = req.user._id;
    const merchant = await Merchant.findById(merchantId);

    if (!merchant) {
      return res.status(404).json({ message: "Merchant not found" });
    }

    const product = new Product({
      user: merchantId,
      name,
      category,
      quantity: parseInt(quantity),
      price: parseFloat(price),
      description,
      shopKey: merchant.shopKey,
    });

    const newProduct = await product.save();
    res.status(201).json({ message: "Product created successfully", product: newProduct });
  } catch (error) {
    res.status(500).json({ message: "Error creating product", error: error.message });
  }
};




// Get products for the merchant (user is a merchant)
export const getMerchantProducts = async (req, res) => {
  try {
    const products = await Product.find({ user: req.user._id });
    res.status(200).json(products);
  } catch (error) {
    res.status(500).json({ message: "Error fetching merchant products", error: error.message });
  }
};


export const shopProducts = async (req, res) => {
  try {
    const { workerId } = req.params; // Assuming workerId is passed in the request params

    // Find the worker by ID
    const worker = await Worker.findById(workerId);
    if (!worker) {
      return res.status(404).json({ message: "Worker not found" });
    }

    // Fetch products that have the same shopKey as the worker
    const products = await Product.find({ shopKey: worker.shopKey });

    res.status(200).json(products);
  } catch (error) {
    console.error("Error fetching shop products:", error);
    res.status(500).json({ message: "Server error" });
  }
};


// Get all products available for customers
export const getCustomerProducts = async (req, res) => {
  try {
    const products = await Product.find({ quantity: { $gt: 0 } }); // Only products with stock available
    res.status(200).json(products);
  } catch (error) {
    res.status(500).json({ message: "Error fetching products", error: error.message });
  }
};

// Get all products (for admin or anyone with access)
export const getAllProducts = async (req, res) => {
  try {
    const products = await Product.find();
    res.status(200).json(products);
  } catch (error) {
    res.status(500).json({ message: "Error fetching all products", error: error.message });
  }
};

// Get a single product by ID
export const getProductById = async (req, res) => {
  const { id } = req.params;
  try {
    const product = await Product.findById(id);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }
    res.status(200).json(product);
  } catch (error) {
    res.status(500).json({ message: "Error fetching product", error: error.message });
  }
};

// Delete a product
export const deleteProduct = async (req, res) => {
  const { id } = req.params;
  try {
    const product = await Product.findById(id);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }
    await product.remove();
    res.status(200).json({ message: "Product deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting product", error: error.message });
  }
};

// Update product details
export const updateProduct = async (req, res) => {
  const { id } = req.params;
  const { name, category, quantity, price, description } = req.body;

  try {
    const product = await Product.findById(id);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    product.name = name || product.name;
    product.category = category || product.category;
    product.quantity = quantity || product.quantity;
    product.price = price || product.price;
    product.description = description || product.description;

    const updatedProduct = await product.save();
    res.status(200).json(updatedProduct);
  } catch (error) {
    res.status(500).json({ message: "Error updating product", error: error.message });
  }
};
