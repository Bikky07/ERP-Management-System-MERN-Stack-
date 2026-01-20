import SalesOrder from "../models/SalesOrder.js";
import Product from "../models/Product.js";

export const createSalesOrder = async (req, res) => {
  try {
    const { customer, products } = req.body;

    if (!customer || !products || products.length === 0) {
      return res.status(400).json({ message: "Invalid sales order data" });
    }

    // CALCULATE TOTAL
    let totalAmount = 0;

    for (const item of products) {
      const product = await Product.findById(item.product);
      if (!product) {
        return res.status(400).json({ message: "Product not found" });
      }
      totalAmount += product.price * item.quantity;
    }

    const order = await SalesOrder.create({
      customer,
      products,
      totalAmount,
    });

    res.status(201).json(order);
  } catch (error) {
    console.error("Sales Order Error:", error);
    res.status(500).json({ message: error.message });
  }
};
