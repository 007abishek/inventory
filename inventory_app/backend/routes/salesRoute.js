import express from "express";
import { 
    placeSaleCod, 
    listSales, 
    getSalesReport, 
    getTrendingProducts, 
    getRevenueDashboard ,
    getStockAnalysis 
} from "../controllers/salescontroller.js";
import { protectMerchant } from "../middleware/authMiddleware.js";

const router = express.Router();

// Route to record a sale using Cash on Delivery (COD)
router.post("/place-sale-cod", placeSaleCod);

// Route to list sales for a merchant
router.get("/list-sales", protectMerchant, listSales);

// Route to get sales report
router.get("/sales-report", protectMerchant, getSalesReport);

// Route to get trending products
router.get("/trending-products", protectMerchant, getTrendingProducts);

// Route to get revenue dashboard
router.get("/revenue-dashboard", protectMerchant, getRevenueDashboard);

// Route to get stock analysis
router.get("/stock-analysis", protectMerchant, getStockAnalysis);

export default router;
