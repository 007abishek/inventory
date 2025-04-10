import dotenv from "dotenv";
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import path from "path";
import { fileURLToPath } from "url";
import connectDB from "./config/db.js";
import Stripe from "stripe";
import Product from "./models/productModel.js"; // Import Product model

// Routes and Middleware
import workerRoute from "./routes/workerRoute.js";
import merchantRoute from "./routes/merchantRoute.js";
import productRoute from "./routes/productRoute.js";
import cartRoutes from "./routes/cartRoute.js";
import salesRoute from "./routes/salesRoute.js";
import errorHandler from "./middleware/errorMiddleware.js";

dotenv.config();
connectDB();

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
const app = express();

// __dirname setup for ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

const allowedOrigins = [
  "http://localhost:5173",
  "http://localhost:5174",
  "http://localhost:5175",
  "https://inventory-frontend-customer.onrender.com",
  "https://inventory-frontend-8hj3.onrender.com",
];

app.use(
  cors({
    origin: (origin, callback) => {
      if (allowedOrigins.includes(origin) || !origin) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
    credentials: true,
  })
);

// Static file serving
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// API Routes
app.use("/api/worker", workerRoute);
app.use("/api/merchants", merchantRoute);
app.use("/api/products", productRoute);
app.use("/api/cart", cartRoutes);
app.use("/api/sales", salesRoute);

// Stripe Payment Route
app.post("/api/payment/stripe", async (req, res) => {
  try {
    const { amount } = req.body;
    if (!amount) return res.status(400).json({ error: "Amount is required" });

    const paymentIntent = await stripe.paymentIntents.create({
      amount: amount * 100, // convert to paisa
      currency: "inr",
      payment_method_types: ["card"],
    });

    res.json({ clientSecret: paymentIntent.client_secret });
  } catch (error) {
    console.error("Stripe Payment Error:", error.message);
    res.status(500).json({ error: error.message });
  }
});

// Dialogflow Webhook Route
app.post("/dialogflow-webhook", async (req, res) => {
  try {
    const intent = req.body.queryResult.intent.displayName;
    const productName = req.body.queryResult.parameters.product;

    if (intent === "CheckStock") {
      const product = await Product.findOne({
        name: { $regex: new RegExp(productName, "i") }
      });

      if (product) {
        const message = `Yes, ${product.name} is available with ${product.quantity} units in stock.`;
        res.json({ fulfillmentText: message });
      } else {
        res.json({ fulfillmentText: `Sorry, ${productName} is not available in stock.` });
      }
    } else {
      res.json({ fulfillmentText: "Intent not handled yet." });
    }
  } catch (err) {
    console.error("Dialogflow webhook error:", err);
    res.json({ fulfillmentText: "There was an error processing your request." });
  }
});

// Base Route
app.get("/", (req, res) => {
  res.send("Welcome to the Inventory Management API");
});

// Error Handler
app.use(errorHandler);

// Start Server
const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

// Graceful Shutdown
process.on("unhandledRejection", (err) => {
  console.error("Unhandled Rejection:", err.message);
  process.exit(1);
});
