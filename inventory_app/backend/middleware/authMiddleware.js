import jwt from "jsonwebtoken";
import asyncHandler from "express-async-handler";
import Merchant from "../models/merchantModel.js";
import Worker from "../models/workerModel.js";

const verifyToken = (req) => {
   const token = req.headers.authorization?.split(" ")[1]; // Extract token from "Bearer <token>"
   if (!token) {
      throw new Error("Not authorized, no token provided");
   }
   return jwt.verify(token, process.env.JWT_SECRET);
};

// Protect route for merchants
const protectMerchant = asyncHandler(async (req, res, next) => {
   try {
      const decoded = verifyToken(req);
      const merchant = await Merchant.findById(decoded.id).select("-password");

      if (!merchant) {
         return res.status(401).json({ message: "Merchant not found" });
      }

      req.user = merchant;
      next();
   } catch (error) {
      return res.status(401).json({ message: "Not authorized, invalid token" });
   }
});

// Protect route for workers
const protectWorker = asyncHandler(async (req, res, next) => {
   try {
      const decoded = verifyToken(req);
      const worker = await Worker.findById(decoded.id).select("-password");

      if (!worker) {
         return res.status(401).json({ message: "Worker not found" });
      }

      req.user = worker;
      next();
   } catch (error) {
      return res.status(401).json({ message: "Not authorized, invalid token" });
   }
});

export { protectMerchant, protectWorker };
