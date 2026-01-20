import { useEffect, useState } from "react";
import api from "../api/api";
import "./PurchaseOrders.css";

export default function PurchaseOrders() {
  const [orders, setOrders] = useState([]);
  const [suppliers, setSuppliers] = useState([]);
  const [products, setProducts] = useState([]);

  const [supplier, setSupplier] = useState("");
  const [items, setItems] = useState([
    { product: "", quantity: 1 },
  ]);

  useEffect(() => {
    loadAll();
  }, []);

  const loadAll = async () => {
    try {
      const [po, s, p] = await Promise.all([
        api.get("/purchase-orders"),
        api.get("/suppliers"),
        api.get("/products"),
      ]);

      setOrders(po.data || []);
      setSuppliers(s.data || []);
      setProducts(p.data || []);
    } catch (err) {
      console.error("Purchase order load error:", err);
    }
  };

  const addItem = () => {
    setItems([...items, { product: "", quantity: 1 }]);
  };

  const updateItem = (index, field, value) => {
    const updated = [...items];
    updated[index][field] = value;
    setItems(updated);
  };

  const createPO = async (e) => {
    e.preventDefault();

    if (!supplier) {
      alert("Supplier required");
      return;
    }

    try {
      await api.post("/purchase-orders", {
        supplier,     // ✅ ObjectId
        items,
      });

      setSupplier("");
      setItems([{ product: "", quantity: 1 }]);
      loadAll();
    } catch (err) {
      console.error("Create purchase order error:", err);
    }
  };

  return (
    <div className="po-page">
      <h1>Purchase Orders</h1>

      {/* CREATE PURCHASE ORDER */}
      <form className="po-form" onSubmit={createPO}>
        <select
          value={supplier}
          onChange={(e) => setSupplier(e.target.value)}
        >
          <option value="">Select Supplier</option>
          {suppliers.map((s) => (
            <option key={s._id} value={s._id}>
              {s.name}
            </option>
          ))}
        </select>

        {items.map((item, i) => (
          <div className="po-item" key={i}>
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
                updateItem(i, "quantity", Number(e.target.value))
              }
            />
          </div>
        ))}

        <div className="po-actions">
          <button type="button" onClick={addItem}>
            + Add Product
          </button>

          <button type="submit">
            Create Purchase Order
          </button>
        </div>
      </form>

      {/* PURCHASE ORDER LIST */}
      <div className="po-table-box">
        <h3>Purchase Order List</h3>

        <div className="po-table-scroll">
          <table>
            <thead>
              <tr>
                <th>Supplier</th>
                <th>Items</th>
                <th>Status</th>
                <th>Date</th>
              </tr>
            </thead>

            <tbody>
              {orders.map((o) => (
                <tr key={o._id}>
                  <td>{o.supplier?.name || "-"}</td>
                  <td>{o.items?.length || 0}</td>
                  <td>{o.status || "Pending"}</td>
                  <td>
                    {o.createdAt
                      ? new Date(o.createdAt).toLocaleDateString()
                      : "-"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
