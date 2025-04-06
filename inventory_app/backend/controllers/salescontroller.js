import salesModel from "../models/salesModel.js";
import workerModel from "../models/workerModel.js";
import Product from "../models/productModel.js";
import mongoose from "mongoose";

const placeSaleCod = async (req, res) => {
    try {
        const { WorkerId, items, amount, customerDetails } = req.body;

        if (!WorkerId || !mongoose.Types.ObjectId.isValid(WorkerId)) {
            return res.status(400).json({ success: false, message: "Invalid Worker ID" });
        }

        // Check if worker exists and get merchantId
        const workerExists = await workerModel.findById(WorkerId).select("merchantId");
        if (!workerExists) {
            return res.status(404).json({ success: false, message: "Worker not found" });
        }

        // Reduce product quantity
        for (const item of items) {
            const product = await Product.findById(item.itemId);
            if (!product) {
                return res.status(404).json({ success: false, message: `Product with ID ${item.itemId} not found` });
            }
            if (product.quantity < item.quantity) {
                return res.status(400).json({ success: false, message: `Insufficient stock for ${product.name}` });
            }
            product.quantity -= item.quantity;
            await product.save();
        }

        // Create a new sale with merchantId
        const newSale = new salesModel({
            WorkerId,
            merchantId: workerExists.merchantId, // Linking sale to merchant
            items,
            amount,
            customerDetails,
            payment: true,
        });

        await newSale.save();

        console.log("Sale Recorded Successfully");
        return res.status(200).json({ success: true, message: "Sale Recorded Successfully" });

    } catch (error) {
        console.error("Error recording sale:", error);
        return res.status(500).json({ success: false, message: "Error recording sale" });
    }
};

// Listing Sales for Merchant 
const listSales = async (req, res) => {
    try {
        console.log("Merchant Data:", req.user); // Debugging log

        if (!req.user || !req.user.id) {
            return res.status(401).json({ success: false, message: "Unauthorized: Merchant ID not found" });
        }

        const merchantId = req.user.id;

        const sales = await salesModel
            .find({ merchantId })
            .sort({ date: -1 })
            .populate({
                path: "WorkerId",
                model: "Worker",
                select: "name", // Fetch only the worker's name
            })
            .populate({
                path: "items.product",
                model: "Product",
                select: "name", // Fetch product name
            });

        res.status(200).json({ success: true, sales });
    } catch (error) {
        res.status(500).json({ success: false, message: "Error fetching sales", error: error.message });
    }
};



const getSalesReport = async (req, res) => {
    try {
        const { period } = req.query;
        const merchantId = req.user._id; // Ensure merchantId is coming from protectMerchant middleware

        if (!merchantId) {
            return res.status(401).json({ message: "Unauthorized: Merchant ID not found" });
        }

        let groupByFormat;
        if (period === "daily") groupByFormat = "%Y-%m-%d";
        else if (period === "weekly") groupByFormat = "%Y-%U";
        else if (period === "monthly") groupByFormat = "%Y-%m";
        else return res.status(400).json({ message: "Invalid period" });

        const salesData = await salesModel.aggregate([
            { $match: { merchantId: new mongoose.Types.ObjectId(merchantId) } },
            {
                $group: {
                    _id: { $dateToString: { format: groupByFormat, date: "$date" } },
                    totalSales: { $sum: "$amount" },
                    totalOrders: { $sum: 1 },
                },
            },
            { $sort: { _id: 1 } },
        ]);

        if (salesData.length === 0) {
            return res.json({ success: true, message: "No sales data found for this merchant", data: [] });
        }

        res.json({ success: true, data: salesData });
    } catch (error) {
        console.error("Error fetching sales reports:", error);
        res.status(500).json({ message: "Error fetching sales reports", error: error.message });
    }
};


// Get Trending Products
const getTrendingProducts = async (req, res) => {
    try {
        const { days } = req.query;
        const daysAgo = new Date();
        daysAgo.setDate(daysAgo.getDate() - (days || 30)); // Default: last 30 days

        // Ensure only the logged-in merchant's sales are considered
        const merchantId = req.user._id; // Extract merchantId from auth middleware

        const trendingProducts = await salesModel.aggregate([
            { $match: { date: { $gte: daysAgo }, merchantId: new mongoose.Types.ObjectId(merchantId) } }, 
            { $unwind: "$items" },
            {
                $group: {
                    _id: { $toObjectId: "$items.itemId" },  // Ensure ObjectId format
                    totalSold: { $sum: "$items.quantity" },
                },
            },
            { $sort: { totalSold: -1 } },
            { $limit: 5 }, // Get top 5 trending products
            {
                $lookup: {
                    from: "products",
                    localField: "_id",
                    foreignField: "_id",
                    as: "productDetails",
                },
            },
            { $unwind: "$productDetails" },
            {
                $project: {
                    _id: 0,
                    productId: "$_id",
                    name: "$productDetails.name",
                    totalSold: 1,
                },
            },
        ]);

        if (!trendingProducts.length) {
            return res.json({ success: true, message: "No trending products found.", data: [] });
        }

        res.json({ success: true, data: trendingProducts });
    } catch (error) {
        console.error("Error fetching trending products:", error.message);
        res.status(500).json({ success: false, message: "Error fetching trending products" });
    }
};


const getRevenueDashboard = async (req, res) => {
    try {
        const merchantId = req.user._id; // Get merchantId from authenticated merchant

        // Total revenue for the logged-in merchant
        const totalEarnings = await salesModel.aggregate([
            { $match: { merchantId } }, // Filter by merchantId
            { $group: { _id: null, totalRevenue: { $sum: "$amount" } } },
        ]);

        // Monthly revenue trend
        const monthlyEarnings = await salesModel.aggregate([
            { $match: { merchantId } }, // Filter by merchantId
            {
                $group: {
                    _id: { $dateToString: { format: "%Y-%m", date: "$date" } },
                    totalRevenue: { $sum: "$amount" },
                },
            },
            { $sort: { _id: -1 } },
            { $limit: 2 }, // Fetch last 2 months' earnings
        ]);

        let lastMonth = 0, thisMonth = 0;
        if (monthlyEarnings.length > 0) {
            thisMonth = monthlyEarnings[0]?.totalRevenue || 0;
            lastMonth = monthlyEarnings[1]?.totalRevenue || 0;
        }

        res.json({
            success: true,
            totalEarnings: totalEarnings[0]?.totalRevenue || 0,
            monthlyTrend: { thisMonth, lastMonth, change: thisMonth - lastMonth },
        });
    } catch (error) {
        console.error("Error fetching revenue data:", error);
        res.status(500).json({ success: false, message: "Error fetching revenue data" });
    }
};



const getStockAnalysis = async (req, res) => {
    try {
        const last30Days = new Date();
        last30Days.setDate(last30Days.getDate() - 30);
        last30Days.setHours(0, 0, 0, 0); // Normalize to start of the day

        console.log("Fetching sales from:", last30Days); // Debug log

        if (!req.user || !req.user._id) {
            return res.status(401).json({ success: false, message: "Unauthorized access" });
        }

        const merchantId = req.user._id; // Get merchantId from authenticated user

        const productSales = await salesModel.aggregate([
            { 
                $match: { 
                    date: { $gte: last30Days }, 
                    merchantId: new mongoose.Types.ObjectId(merchantId) // Ensure matching merchant
                } 
            },
            { $unwind: "$items" },
            {
                $group: {
                    _id: { $toObjectId: "$items.itemId" }, // Convert itemId to ObjectId
                    totalSold: { $sum: "$items.quantity" },
                },
            },
            { $sort: { totalSold: -1 } },
            { $limit: 10 }, // Get top 10 products
            {
                $lookup: {
                    from: "products", // Ensure correct collection name
                    localField: "_id",
                    foreignField: "_id",
                    as: "productDetails",
                },
            },
            { $unwind: { path: "$productDetails", preserveNullAndEmptyArrays: true } }, // Handle missing product
            {
                $project: {
                    _id: 1,
                    name: { $ifNull: ["$productDetails.name", "Unknown Product"] }, // Handle missing name
                    totalSold: 1,
                    stockLeft: { $ifNull: ["$productDetails.quantity", 0] }, // Handle missing stock
                },
            },
        ]);

        res.json({ success: true, data: productSales });
    } catch (error) {
        console.error("Error fetching stock analysis:", error);
        res.status(500).json({ success: false, message: "Error fetching stock analysis" });
    }
};


export { placeSaleCod, listSales, getSalesReport, getTrendingProducts ,getRevenueDashboard ,getStockAnalysis };
