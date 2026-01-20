import Product from "../models/Product.js";
import Customer from "../models/Customer.js";
import SalesOrder from "../models/SalesOrder.js";
import PurchaseOrder from "../models/PurchaseOrder.js";

export const getDashboardStats = async (req, res) => {
  try {
    const totalProducts = await Product.countDocuments();
    const totalCustomers = await Customer.countDocuments();
    const totalSales = await SalesOrder.countDocuments();
    const totalPurchases = await PurchaseOrder.countDocuments();

    const recentSales = await SalesOrder.find()
      .sort({ createdAt: -1 })
      .limit(5);

    const recentPurchases = await PurchaseOrder.find()
      .sort({ createdAt: -1 })
      .limit(5);

    res.json({
      totalProducts,
      totalCustomers,
      totalSales,
      totalPurchases,
      recentSales,
      recentPurchases
    });
  } catch (error) {
    res.status(500).json({ message: "Dashboard error", error });
  }
};
