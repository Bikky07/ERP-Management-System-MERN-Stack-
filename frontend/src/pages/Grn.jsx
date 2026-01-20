import { useEffect, useState } from "react";
import api from "../api/api";
import "./Grn.css";

export default function GRN() {
  const [purchaseOrders, setPurchaseOrders] = useState([]);
  const [selectedPO, setSelectedPO] = useState("");
  const [currentPO, setCurrentPO] = useState(null);
  const [receivedItems, setReceivedItems] = useState([]);

  useEffect(() => {
    loadPOs();
  }, []);

  const loadPOs = async () => {
    try {
      const res = await api.get("/purchase-orders");
      setPurchaseOrders(res.data || []);
    } catch (err) {
      console.error("Load PO error", err);
    }
  };

  const selectPO = (id) => {
    setSelectedPO(id);

    const po = purchaseOrders.find((p) => p._id === id);
    setCurrentPO(po || null);

    if (po?.items) {
      setReceivedItems(
        po.items.map((i) => ({
          product: i.product?._id || i.product,
          quantity: i.quantity,
        }))
      );
    }
  };

  const updateQty = (index, value) => {
    const updated = [...receivedItems];
    updated[index].quantity = Number(value);
    setReceivedItems(updated);
  };

  const saveGRN = async () => {
    if (!currentPO) {
      alert("Select Purchase Order");
      return;
    }

    const payload = {
      supplier: currentPO.supplier,
      purchaseOrder: currentPO._id,
      receivedItems: receivedItems.map((i) => ({
        product: i.product,
        quantity: Number(i.quantity),
      })),
    };

    try {
      await api.post("/grn", payload);
      alert("GRN Created Successfully");

      setSelectedPO("");
      setCurrentPO(null);
      setReceivedItems([]);
    } catch (err) {
      console.error("GRN error", err);
      alert("GRN creation failed");
    }
  };

  return (
    <div className="grn-page">
      <h1>Goods Receipt Note (GRN)</h1>

      <div className="grn-card">
        <label>Select Purchase Order</label>

        <select value={selectedPO} onChange={(e) => selectPO(e.target.value)}>
          <option value="">Select PO</option>
          {purchaseOrders.map((po) => (
            <option key={po._id} value={po._id}>
              {po.supplier?.name || po.supplier} — {po._id.slice(-5)}
            </option>
          ))}
        </select>

        {currentPO && (
          <>
            <h3>Received Items</h3>

            {receivedItems.map((item, i) => (
              <div className="grn-item" key={i}>
                <span>{currentPO.items[i]?.product?.name}</span>

                <input
                  type="number"
                  min="1"
                  value={item.quantity}
                  onChange={(e) => updateQty(i, e.target.value)}
                />
              </div>
            ))}

            <button onClick={saveGRN}>Save GRN</button>
          </>
        )}
      </div>
    </div>
  );
}
