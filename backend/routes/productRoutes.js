import express from "express";
import Product from "../models/Product.js";
import { protect, authorize } from "../middleware/authMiddleware.js";

const router = express.Router();

// CREATE PRODUCT (Admin only)
router.post("/", protect, authorize("admin","sales"), async (req, res) => {
  const product = await Product.create(req.body);
  res.status(201).json(product);
});

// GET ALL PRODUCTS
router.get("/", protect, async (req, res) => {
  const products = await Product.find();
  res.json(products);
});

// UPDATE PRODUCT
router.put("/:id", protect, authorize("admin"), async (req, res) => {
  const product = await Product.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true }
  );
  res.json(product);
});

// DELETE PRODUCT
router.delete("/:id", protect, authorize("admin"), async (req, res) => {
  await Product.findByIdAndDelete(req.params.id);
  res.json({ message: "Product deleted" });
});

export default router;
