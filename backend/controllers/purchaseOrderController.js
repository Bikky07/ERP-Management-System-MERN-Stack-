import PurchaseOrder from "../models/PurchaseOrder.js";

// CREATE PO
export const createPurchaseOrder = async (req, res) => {
  try {
    const po = await PurchaseOrder.create(req.body);
    res.status(201).json(po);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// GET ALL PO
export const getPurchaseOrders = async (req, res) => {
  try {
    const orders = await PurchaseOrder.find().populate(
      "items.product",
      "name"
    );
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
