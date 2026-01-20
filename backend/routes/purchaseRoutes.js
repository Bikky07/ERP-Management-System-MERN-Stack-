import express from "express";
import PurchaseOrder from "../models/PurchaseOrder.js";
import { protect, authorize } from "../middleware/authMiddleware.js";

const router = express.Router();

// CREATE PURCHASE ORDER
router.post("/", protect, authorize("admin", "purchase","sales"), async (req, res) => {
  try {
    const order = await PurchaseOrder.create(req.body);
    res.status(201).json(order);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// GET ALL PURCHASE ORDERS
router.get("/", protect, async (req, res) => {
  const orders = await PurchaseOrder.find().populate("products.product");
  res.json(orders);
});

export default router;
