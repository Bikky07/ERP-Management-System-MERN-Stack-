import express from "express";
import {
  createPurchaseOrder,
  getPurchaseOrders,
} from "../controllers/purchaseOrderController.js";
import { protect, authorize } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/", protect, authorize("admin", "purchase"), createPurchaseOrder);
router.get("/", protect, authorize("admin", "purchase"), getPurchaseOrders);

export default router;
