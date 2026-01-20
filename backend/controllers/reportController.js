import SalesOrder from "./SalesOrder.js";
import PurchaseOrder from "./PurchaseOrder.js";
import Product from "./Product.js";

/* SALES REPORT */
export const salesReport = async (req, res) => {
  try {
    const orders = await SalesOrder.find()
      .populate("customer", "name")
      .populate("items.product", "name");

    const report = orders.map((o) => {
      const total = o.items.reduce(
        (sum, i) => sum + i.quantity * i.price,
        0
      );

      return {
        OrderID: o._id,
        Customer: o.customer?.name || "-",
        Items: o.items.length,
        TotalAmount: total,
        Status: o.status,
        Date: o.createdAt.toISOString().split("T")[0],
      };
    });

    res.json(report);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/* PURCHASE REPORT */
export const purchaseReport = async (req, res) => {
  try {
    const orders = await PurchaseOrder.find();

    res.json(
      orders.map((o) => ({
        OrderID: o._id,
        Supplier: o.supplier,
        Items: o.items.length,
        Status: o.status,
        Date: o.createdAt.toISOString().split("T")[0],
      }))
    );
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/* INVENTORY REPORT */
export const inventoryReport = async (req, res) => {
  try {
    const products = await Product.find();

    res.json(
      products.map((p) => ({
        Product: p.name,
        Stock: p.stock,
        Price: p.price,
        Status:
          p.stock === 0
            ? "Out of Stock"
            : p.stock < 10
            ? "Low Stock"
            : "In Stock",
      }))
    );
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
