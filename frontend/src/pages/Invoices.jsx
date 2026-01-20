import { useEffect, useState } from "react";
import api from "../api/api";
import "./Invoices.css";

export default function Invoices() {
  const [salesOrders, setSalesOrders] = useState([]);
  const [invoices, setInvoices] = useState([]);
  const [selectedSO, setSelectedSO] = useState("");
  const [currentSO, setCurrentSO] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const soRes = await api.get("/sales-orders");
      setSalesOrders(soRes.data || []);
    } catch {
      setSalesOrders([]);
    }

    try {
      const invRes = await api.get("/invoices");
      setInvoices(invRes.data || []);
    } catch {
      setInvoices([]);
    }
  };

  const handleSelectSO = (id) => {
    setSelectedSO(id);
    const so = salesOrders.find((s) => s._id === id);
    setCurrentSO(so || null);
  };

  const createInvoice = async () => {
    if (!currentSO) {
      alert("Select a Sales Order");
      return;
    }

    if (!currentSO.customer) {
      alert("Sales Order has no customer");
      return;
    }

    if (!currentSO.items || currentSO.items.length === 0) {
      alert("Sales Order has no items");
      return;
    }

    try {
      setLoading(true);
      await api.post("/invoices", {
        salesOrder: currentSO._id,
      });

      setSelectedSO("");
      setCurrentSO(null);
      loadData();
    } catch (err) {
      console.error(err.response?.data);
      alert(err.response?.data?.message || "Invoice creation failed");
    } finally {
      setLoading(false);
    }
  };

  const markAsPaid = async (id) => {
    try {
      await api.put(`/invoices/${id}/pay`);
      loadData();
    } catch {
      alert("Failed to update invoice");
    }
  };

  return (
    <div className="invoice-page">
      <h1>Invoices</h1>

      {/* CREATE INVOICE */}
      <div className="invoice-card">
        <h3>Create Invoice</h3>

        <select value={selectedSO} onChange={(e) => handleSelectSO(e.target.value)}>
          <option value="">Select Sales Order</option>
          {salesOrders.map((so) => (
            <option key={so._id} value={so._id}>
              {so.customer?.name || "No Customer"} — {so._id.slice(-5)}
            </option>
          ))}
        </select>

        {currentSO && (
          <div className="invoice-preview">
            <p>
              <strong>Customer:</strong>{" "}
              {currentSO.customer?.name || "-"}
            </p>

            <table>
              <thead>
                <tr>
                  <th>Product</th>
                  <th>Qty</th>
                </tr>
              </thead>
              <tbody>
                {currentSO.items.map((i, idx) => (
                  <tr key={idx}>
                    <td>{i.product?.name || "Product"}</td>
                    <td>{i.quantity}</td>
                  </tr>
                ))}
              </tbody>
            </table>

            <p>
              <strong>Total:</strong> ₹{currentSO.totalAmount || 0}
            </p>

            <button onClick={createInvoice} disabled={loading}>
              {loading ? "Creating..." : "Generate Invoice"}
            </button>
          </div>
        )}
      </div>

      {/* INVOICE LIST */}
      <div className="invoice-list">
        <h3>Invoice List</h3>

        <div className="table-box">
          <table>
            <thead>
              <tr>
                <th>Customer</th>
                <th>Total</th>
                <th>Status</th>
                <th>Action</th>
                <th>Date</th>
              </tr>
            </thead>

            <tbody>
              {invoices.length === 0 ? (
                <tr>
                  <td colSpan="5" style={{ textAlign: "center" }}>
                    No invoices yet
                  </td>
                </tr>
              ) : (
                invoices.map((inv) => (
                  <tr key={inv._id}>
                    <td>{inv.customer?.name || "-"}</td>
                    <td>₹{inv.totalAmount || 0}</td>

                    <td>
                      <span
                        className={
                          inv.status === "Paid"
                            ? "status paid"
                            : "status unpaid"
                        }
                      >
                        {inv.status}
                      </span>
                    </td>

                    <td>
                      {inv.status === "Unpaid" && (
                        <button
                          className="pay-btn"
                          onClick={() => markAsPaid(inv._id)}
                        >
                          Mark Paid
                        </button>
                      )}
                    </td>

                    <td>{new Date(inv.createdAt).toLocaleDateString()}</td>
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
