import Invoice from "../models/Invoice.js";
import SalesOrder from "../models/SalesOrder.js";

export const createInvoice = async (req, res) => {
  try {
    const { salesOrder } = req.body;

    if (!salesOrder) {
      return res.status(400).json({ message: "Sales order is required" });
    }

    // 1️⃣ Fetch sales order
    const so = await SalesOrder.findById(salesOrder)
      .populate("customer")
      .populate("items.product");

    if (!so) {
      return res.status(404).json({ message: "Sales order not found" });
    }

    // 2️⃣ Create invoice from SO
    const invoice = await Invoice.create({
      salesOrder: so._id,
      customer: so.customer,
      items: so.items,
      totalAmount: so.totalAmount,
      status: "Unpaid",
    });

    res.status(201).json(invoice);
  } catch (error) {
    console.error("Invoice create error:", error);
    res.status(400).json({ message: error.message });
  }
};

export const getInvoices = async (req, res) => {
  const invoices = await Invoice.find()
    .populate("customer", "name")
    .populate("items.product", "name price");

  res.json(invoices);
};
