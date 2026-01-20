import express from "express";
import {
  createSupplier,
  getSuppliers,
  deleteSupplier,
} from "../controllers/supplierController.js";
import { protect, authorize } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/", protect, authorize("admin", "purchase"), createSupplier);
router.get("/", protect, authorize("admin", "purchase"), getSuppliers);
router.delete("/:id", protect, authorize("admin"), deleteSupplier);

export default router;
