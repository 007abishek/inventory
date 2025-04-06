import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import Worker from "../models/workerModel.js";
import Merchant from "../models/merchantModel.js";

// Worker Registration
export const registerWorker = async (req, res) => {
  try {
    const { name, email, password, phone, address, shopKey } = req.body;

    if (!shopKey) return res.status(400).json({ message: "Shop key is required" });

    // Find the merchant using shopKey
    const merchant = await Merchant.findOne({ shopKey });
    if (!merchant) return res.status(404).json({ message: "Invalid shop key. Merchant not found." });

    // Check if worker with same email exists
    const existingWorker = await Worker.findOne({ email });
    if (existingWorker) return res.status(400).json({ message: "Worker already exists with this email" });

    // Hash password before storing
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create and save worker
    const newWorker = new Worker({
      name,
      email,
      password: hashedPassword,
      phone,
      address,
      shopKey,
      merchantId: merchant._id, // Assign merchantId based on shopKey
    });

    await newWorker.save();

    // Generate JWT token
    const token = jwt.sign({ id: newWorker._id, merchantId: merchant._id }, process.env.JWT_SECRET, { expiresIn: "1d" });

    res.cookie("token", token, { httpOnly: true, secure: true, sameSite: "strict" });

    res.status(201).json({ message: "Worker registered successfully", token, workerId: newWorker._id, merchantId: merchant._id });
  } catch (error) {
    console.error("Error registering worker:", error);
    res.status(500).json({ message: "Server error", error });
  }
};

// Worker Login
export const loginWorker = async (req, res) => {
  try {
    const { email, password } = req.body;

    const worker = await Worker.findOne({ email });
    if (!worker) return res.status(400).json({ message: "Invalid email or password" });

    const isMatch = await bcrypt.compare(password, worker.password);
    if (!isMatch) return res.status(400).json({ message: "Invalid email or password" });

    // Generate token with worker ID and merchantId
    const token = jwt.sign({ id: worker._id, merchantId: worker.merchantId }, process.env.JWT_SECRET, { expiresIn: "1d" });

    res.cookie("token", token, { httpOnly: true, secure: true, sameSite: "strict" });

    res.status(200).json({ message: "Login successful", token, workerId: worker._id, merchantId: worker.merchantId });
  } catch (error) {
    console.error("Error during login:", error);
    res.status(500).json({ message: "Server error", error });
  }
};

// Worker Logout
export const logoutWorker = async (req, res) => {
  try {
    res.cookie("token", "", { expires: new Date(0), httpOnly: true });
    res.status(200).json({ message: "Logout successful" });
  } catch (error) {
    console.error("Error during logout:", error);
    res.status(500).json({ message: "Server error", error });
  }
};

// Get All Workers
export const getAllWorkers = async (req, res) => {
  try {
    const workers = await Worker.find().select("-password").populate("merchantId", "shopName shopKey");
    res.status(200).json(workers);
  } catch (error) {
    console.error("Error fetching workers:", error);
    res.status(500).json({ message: "Server error", error });
  }
};

// Get Worker by ID
export const getWorkerById = async (req, res) => {
  try {
    const { id } = req.params;
    const worker = await Worker.findById(id).select("-password").populate("merchantId", "shopName shopKey");

    if (!worker) return res.status(404).json({ message: "Worker not found" });

    res.status(200).json(worker);
  } catch (error) {
    console.error("Error fetching worker:", error);
    res.status(500).json({ message: "Server error", error });
  }
};
