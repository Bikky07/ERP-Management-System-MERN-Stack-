import GRN from "../models/Grn.js";
import Product from "../models/Product.js";

export const createGrn = async (req, res) => {
  try {
    const { supplier, purchaseOrder, receivedItems } = req.body;

    if (!supplier || !receivedItems || receivedItems.length === 0) {
      return res.status(400).json({
        message: "Invalid GRN data",
      });
    }

    const grn = await GRN.create({
      supplier,
      purchaseOrder,
      receivedItems,
    });

    // update stock
    for (const item of receivedItems) {
      await Product.findByIdAndUpdate(item.product, {
        $inc: { stock: item.quantity },
      });
    }

    res.status(201).json(grn);
  } catch (error) {
    console.error("GRN CREATE ERROR:", error);
    res.status(500).json({ message: "GRN creation failed" });
  }
};
