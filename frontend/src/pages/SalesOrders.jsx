import { useEffect, useState } from "react";
import api from "../api/api";
import "./SalesOrders.css";

export default function SalesOrders() {
  const [orders, setOrders] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [products, setProducts] = useState([]);

  const [customer, setCustomer] = useState("");
  const [items, setItems] = useState([{ product: "", quantity: 1 }]);

  // LOAD DATA
  useEffect(() => {
    loadAll();
  }, []);

  const loadAll = async () => {
    try {
      const [soRes, cRes, pRes] = await Promise.all([
        api.get("/sales-orders"),
        api.get("/customers"),
        api.get("/products"),
      ]);

      setOrders(soRes.data || []);
      setCustomers(cRes.data || []);
      setProducts(pRes.data || []);
    } catch (err) {
      console.error("Sales order load error:", err);
    }
  };

  // ADD ITEM ROW
  const addItem = () => {
    setItems([...items, { product: "", quantity: 1 }]);
  };

  // UPDATE ITEM
  const updateItem = (index, field, value) => {
    const updated = [...items];
    updated[index][field] = value;
    setItems(updated);
  };

  // CREATE SALES ORDER
  const createSO = async (e) => {
    e.preventDefault();

    if (!customer) {
      alert("Customer is required");
      return;
    }

    if (items.some((i) => !i.product || i.quantity <= 0)) {
      alert("All products & quantities required");
      return;
    }

    // ✅ CALCULATE TOTAL
    const totalAmount = items.reduce((sum, i) => {
      const p = products.find((p) => p._id === i.product);
      return sum + (p?.price || 0) * Number(i.quantity);
    }, 0);

    try {
      await api.post("/sales-orders", {
        customer,
        items,
        totalAmount,
      });

      setCustomer("");
      setItems([{ product: "", quantity: 1 }]);
      loadAll();
    } catch (err) {
      console.error("Create sales order error:", err);
      alert("Failed to create sales order");
    }
  };

  return (
    <div className="so-page">
      <h1>Sales Orders</h1>

      {/* CREATE SALES ORDER */}
      <form className="so-form" onSubmit={createSO}>
        <select
          value={customer}
          onChange={(e) => setCustomer(e.target.value)}
        >
          <option value="">Select Customer</option>
          {customers.map((c) => (
            <option key={c._id} value={c._id}>
              {c.name}
            </option>
          ))}
        </select>

        {items.map((item, i) => (
          <div className="so-item" key={i}>
            <select
              value={item.product}
              onChange={(e) =>
                updateItem(i, "product", e.target.value)
              }
            >
              <option value="">Select Product</option>
              {products.map((p) => (
                <option key={p._id} value={p._id}>
                  {p.name}
                </option>
              ))}
            </select>

            <input
              type="number"
              min="1"
              value={item.quantity}
              onChange={(e) =>
                updateItem(i, "quantity", e.target.value)
              }
            />
          </div>
        ))}

        <button type="button" onClick={addItem}>
          + Add Product
        </button>

        <button type="submit">Create Sales Order</button>
      </form>

      {/* SALES ORDER LIST */}
      <div className="so-table-box">
        <h3>Sales Order List</h3>

        <div className="so-table-scroll">
          <table>
            <thead>
              <tr>
                <th>Customer</th>
                <th>Items</th>
                <th>Total</th>
                <th>Status</th>
                <th>Date</th>
              </tr>
            </thead>

            <tbody>
              {orders.length === 0 ? (
                <tr>
                  <td colSpan="5" style={{ textAlign: "center" }}>
                    No sales orders
                  </td>
                </tr>
              ) : (
                orders.map((o) => (
                  <tr key={o._id}>
                    <td>{o.customer?.name || "-"}</td>
                    <td>{o.items?.length || 0}</td>
                    <td>₹{o.totalAmount || 0}</td>
                    <td>{o.status}</td>
                    <td>
                      {new Date(o.createdAt).toLocaleDateString()}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
