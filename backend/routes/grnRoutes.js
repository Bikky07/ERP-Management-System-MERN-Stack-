import express from "express";
import mongoose from "mongoose";
import GRN from "../models/Grn.js";
import Product from "../models/Product.js";
import { protect, authorize } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/", protect, authorize("admin", "purchase"), async (req, res) => {
  try {
    const { supplier, receivedItems, purchaseOrder } = req.body;

    if (!supplier || !receivedItems || receivedItems.length === 0) {
      return res.status(400).json({ message: "Invalid GRN data" });
    }

    if (!mongoose.Types.ObjectId.isValid(supplier)) {
      return res.status(400).json({ message: "Invalid supplier" });
    }

    if (purchaseOrder && !mongoose.Types.ObjectId.isValid(purchaseOrder)) {
      return res.status(400).json({ message: "Invalid purchase order" });
    }

    for (const item of receivedItems) {
      if (!mongoose.Types.ObjectId.isValid(item.product)) {
        return res.status(400).json({ message: "Invalid product" });
      }

      const product = await Product.findById(item.product);
      if (!product) {
        return res.status(400).json({ message: "Product not found" });
      }
    }

    const grn = await GRN.create({
      supplier,
      receivedItems,
      purchaseOrder: purchaseOrder || null,
    });

    for (const item of receivedItems) {
      await Product.findByIdAndUpdate(
        item.product,
        { $inc: { stock: item.quantity } }
      );
    }

    res.status(201).json(grn);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
});

export default router;
