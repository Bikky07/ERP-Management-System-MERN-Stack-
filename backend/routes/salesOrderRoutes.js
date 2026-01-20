import express from "express";
import SalesOrder from "../models/SalesOrder.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

/**
 * GET all sales orders
 */
router.get("/", protect, async (req, res) => {
  try {
    const orders = await SalesOrder.find()
      .populate("customer", "name")
      .populate("items.product", "name");

    res.json(orders);
  } catch (error) {
    console.error("❌ Sales order fetch error:", error);
    res.status(500).json({ message: "Failed to load sales orders" });
  }
});

/**
 * CREATE sales order
 */
router.post("/", protect, async (req, res) => {
  try {
    const { customer, items } = req.body;

    const order = new SalesOrder({
      customer,
      items,
      createdBy: req.user._id,
    });

    const savedOrder = await order.save();
    res.status(201).json(savedOrder);
  } catch (error) {
    console.error("❌ Sales order create error:", error);
    res.status(400).json({ message: error.message });
  }
});

export default router;
