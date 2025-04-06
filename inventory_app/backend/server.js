import dotenv from "dotenv";
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import path from "path";
import { fileURLToPath } from "url";
import connectDB from "./config/db.js";
import Stripe from "stripe";  // Import Stripe

// Import Routes and Middleware
import workerRoute from "./routes/workerRoute.js";
import merchantRoute from "./routes/merchantRoute.js";
import productRoute from "./routes/productRoute.js";
import cartRoutes from "./routes/cartRoute.js";
import salesRoute from "./routes/salesRoute.js";
import errorHandler from "./middleware/errorMiddleware.js";

dotenv.config();
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY); // Initialize Stripe

const app = express();

// Get __dirname in ES Module scope
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Middleware Configuration
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

// Multiple origins for CORS
const allowedOrigins = [
  "http://localhost:5173",
  "http://localhost:5174",
  "http://localhost:5175"
];

app.use(
  cors({
    origin: (origin, callback) => {
      if (allowedOrigins.indexOf(origin) !== -1 || !origin) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
    credentials: true,
  })
);

app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Connect to the Database
connectDB();

// API Routes
app.use("/api/worker", workerRoute);
app.use("/api/merchants", merchantRoute);
app.use("/api/products", productRoute);
app.use("/api/cart", cartRoutes);
app.use("/api/sales", salesRoute);

// 🚀 Stripe Payment Route
app.post("/api/payment/stripe", async (req, res) => {
  try {
    const { amount } = req.body;
    
    if (!amount) {
      return res.status(400).json({ error: "Amount is required" });
    }

    // Create a PaymentIntent with Stripe
    const paymentIntent = await stripe.paymentIntents.create({
      amount: amount * 100, // Convert amount to cents
      currency: "inr",
      payment_method_types: ["card"],
    });

    res.json({ clientSecret: paymentIntent.client_secret });
  } catch (error) {
    console.error("Stripe Payment Error:", error.message);
    res.status(500).json({ error: error.message });
  }
});

// Base Route
app.get("/", (req, res) => {
  res.send("Welcome to the API");
});

// Error Middleware
app.use(errorHandler);

// Server Configuration
const PORT = process.env.PORT || 5001;

// Start the Server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

// Graceful Shutdown
process.on("unhandledRejection", (err) => {
  console.error("Unhandled Rejection:", err.message);
  app.close(() => process.exit(1));
});
