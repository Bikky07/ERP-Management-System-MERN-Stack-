import express from "express";
import {
  createCustomer,
  getCustomers,
  deleteCustomer,
} from "../controllers/customerController.js";
import { protect, authorize } from "../middleware/authMiddleware.js";

const router = express.Router();

/* CREATE CUSTOMER */
router.post("/", protect, authorize("admin"), createCustomer);

/* GET ALL CUSTOMERS */
router.get("/", protect, authorize("admin", "sales"), getCustomers);

/* DELETE CUSTOMER ✅ */
router.delete("/:id", protect, authorize("admin"), deleteCustomer);

export default router;
