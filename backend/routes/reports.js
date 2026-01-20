import express from "express";
import SalesOrder from "../models/SalesOrder.js";
import PurchaseOrder from "../models/PurchaseOrder.js";
import Product from "../models/Product.js";

const router = express.Router();

/**
 * DATE FILTER HELPER
 */
const dateFilter = (req) => {
  const { from, to } = req.query;
  let filter = {};

  if (from || to) {
    filter.createdAt = {};
    if (from) filter.createdAt.$gte = new Date(from);
    if (to) filter.createdAt.$lte = new Date(to);
  }
  return filter;
};

/**
 * SALES REPORT
 * GET /api/reports/sales
 */
router.get("/sales", async (req, res) => {
  try {
    const filter = dateFilter(req);

    const orders = await SalesOrder.find(filter).lean();

    const totalOrders = orders.length;
    const totalRevenue = orders.reduce(
      (sum, o) => sum + (o.totalAmount || 0),
      0
    );

    res.json({
      totalOrders,
      totalRevenue,
      orders,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to load sales report",
      error: error.message,
    });
  }
});

/**
 * PURCHASE REPORT
 * GET /api/reports/purchase
 */
router.get("/purchase", async (req, res) => {
  try {
    const filter = dateFilter(req);

    const purchases = await PurchaseOrder.find(filter).lean();

    const totalPurchases = purchases.length;
    const totalCost = purchases.reduce(
      (sum, p) => sum + (p.totalAmount || 0),
      0
    );

    res.json({
      totalPurchases,
      totalCost,
      purchases,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to load purchase report",
      error: error.message,
    });
  }
});

/**
 * INVENTORY REPORT
 * GET /api/reports/inventory
 */
router.get("/inventory", async (req, res) => {
  try {
    const products = await Product.find().lean();

    const lowStock = products.filter(p => p.stock <= 5).length;

    res.json({
      totalProducts: products.length,
      lowStock,
      products,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to load inventory report",
      error: error.message,
    });
  }
});

export default router;
