import express from "express";
import { createInvoice, getInvoices } from "../controllers/invoiceController.js";
import { protect, authorize } from "../middleware/authMiddleware.js";

const router = express.Router();

// Create invoice (Admin / Sales)
router.post("/", protect, authorize("admin", "sales"), createInvoice);

// Get all invoices
router.get("/", protect, authorize("admin", "sales"), getInvoices);

export default router;
