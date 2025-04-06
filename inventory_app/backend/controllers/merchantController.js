import Merchant from "../models/merchantModel.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

// Register Merchant
export const registerMerchant = async (req, res) => {
  try {
    const { name, email, password, phone, address, shopName, shopKey } = req.body;

    const existingMerchant = await Merchant.findOne({ email });
    if (existingMerchant) {
      return res.status(400).json({ message: "Merchant already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const merchant = new Merchant({
      name,
      email,
      password: hashedPassword,
      phone,
      address,
      shopName,
      shopKey, // Added shopKey for workers' login
    });

    await merchant.save();

    const token = jwt.sign({ id: merchant._id }, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });

    res.cookie("token", token, { httpOnly: true, secure: true, sameSite: "strict" });

    res.status(201).json({ message: "Merchant registered successfully", token });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};


// Login Merchant
export const loginMerchant = async (req, res) => {
  try {
    const { email, password } = req.body;

    const merchant = await Merchant.findOne({ email });
    if (!merchant) {
      return res.status(404).json({ message: "Merchant not found" });
    }

    const isMatch = await bcrypt.compare(password, merchant.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign({ id: merchant._id }, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });

    res.cookie("token", token, { httpOnly: true, secure: true, sameSite: "strict" });

    res.json({ message: "Login successful", token });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

// Logout Merchant
export const logoutMerchant = (req, res) => {
  res.cookie("token", "", { expires: new Date(0), httpOnly: true });
  res.json({ message: "Logout successful" });
};

// Get all Merchants
export const getAllMerchants = async (req, res) => {
  try {
    const merchants = await Merchant.find();
    res.json(merchants);
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

// Get Merchant by ID
export const getMerchantById = async (req, res) => {
  try {
    const merchant = await Merchant.findById(req.params.id);
    if (!merchant) {
      return res.status(404).json({ message: "Merchant not found" });
    }
    res.json(merchant);
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

