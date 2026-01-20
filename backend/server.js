import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import mongoose from "mongoose";

// ROUTES
import authRoutes from "./routes/authRoutes.js";
import productRoutes from "./routes/productRoutes.js";
import customerRoutes from "./routes/customerRoutes.js";
import purchaseOrderRoutes from"./routes/purchaseOrderRoutes.js";
import grnRoutes from "./routes/grnRoutes.js";
import salesOrderRoutes from "./routes/salesOrderRoutes.js";
import invoiceRoutes from "./routes/invoiceRoutes.js";
import dashboardRoutes from "./routes/dashboardRoutes.js";
import reportsRoutes from "./routes/reports.js";

import supplierRoutes from "./routes/supplierRoutes.js";

// LOAD ENV VARIABLES
dotenv.config();

// INIT APP
const app = express();

// MIDDLEWARE
app.use(cors());
app.use(express.json());

// ROUTE
app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);
app.use("/api/customers", customerRoutes);
app.use("/api/purchase-orders", purchaseOrderRoutes);
app.use("/api/grn", grnRoutes);
app.use("/api/sales-orders", salesOrderRoutes);
app.use("/api/invoices", invoiceRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/suppliers", supplierRoutes);
app.use("/api/reports", reportsRoutes);




// TEST ROUTE
app.get("/", (req, res) => {
  res.send("API is running...");
});

// CONNECT DATABASE
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("✅ MongoDB Connected");
    app.listen(process.env.PORT || 5000, () => {
      console.log(`🚀 Server running on http://localhost:${process.env.PORT || 5000}`);
    });
  })
  .catch((err) => {
    console.error("❌ MongoDB connection error:", err);
  });
