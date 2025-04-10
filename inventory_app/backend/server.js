import dotenv from "dotenv";
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import path from "path";
import { fileURLToPath } from "url";
import connectDB from "./config/db.js";
import Stripe from "stripe";

// Import Routes and Middleware
import workerRoute from "./routes/workerRoute.js";
import merchantRoute from "./routes/merchantRoute.js";
import productRoute from "./routes/productRoute.js";
import cartRoutes from "./routes/cartRoute.js";
import salesRoute from "./routes/salesRoute.js";
import errorHandler from "./middleware/errorMiddleware.js";

// Import Mongoose Model
import Product from "./models/productModel.js";

dotenv.config();
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
const app = express();

// Get __dirname
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
  "https://inventory-frontend-8hj3.onrender.com"
];

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
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

// Connect to DB
connectDB();

// Routes
app.use("/api/worker", workerRoute);
app.use("/api/merchants", merchantRoute);
app.use("/api/products", productRoute);
app.use("/api/cart", cartRoutes);
app.use("/api/sales", salesRoute);

// 💬 Dialogflow Webhook Integration
app.post("/dialogflow-webhook", async (req, res) => {
  try {
    const intent = req.body.queryResult.intent.displayName;
    const productName = req.body.queryResult.parameters.product;

    if (intent === "CheckStock") {
      const product = await Product.findOne({
        name: { $regex: new RegExp(productName, "i") }
      });

      if (product) {
        const message = `Yes, ${product.name} is available with ${product.stock} units in stock.`;
        res.json({ fulfillmentText: message });
      } else {
        const message = `Sorry, ${productName} is not available in stock.`;
        res.json({ fulfillmentText: message });
      }
    } else {
      res.json({ fulfillmentText: "Intent not handled yet." });
    }
  } catch (err) {
    console.error("Dialogflow webhook error:", err);
    res.json({ fulfillmentText: "There was an error processing your request." });
  }
});

// 💳 Stripe Payment Route
app.post("/api/payment/stripe", async (req, res) => {
  try {
    const { amount } = req.body;
    if (!amount) {
      return res.status(400).json({ error: "Amount is required" });
    }

    const paymentIntent = await stripe.paymentIntents.create({
      amount: amount * 100,
      currency: "inr",
      payment_method_types: ["card"],
    });

    res.json({ clientSecret: paymentIntent.client_secret });
  } catch (error) {
    console.error("Stripe Payment Error:", error.message);
    res.status(500).json({ error: error.message });
  }
});

// Root Route
app.get("/", (req, res) => {
  res.send("Welcome to the API");
});

// Error Middleware
app.use(errorHandler);

// Server Start
const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

// Graceful Shutdown
process.on("unhandledRejection", (err) => {
  console.error("Unhandled Rejection:", err.message);
  process.exit(1);
});
