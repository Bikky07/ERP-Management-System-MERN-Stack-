import { useEffect, useState } from "react";
import api from "../api/api";
import "./Inventory.css";

export default function Inventory() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    loadStock();
  }, []);

  const loadStock = async () => {
    const res = await api.get("/products");
    setProducts(res.data);
  };

  return (
    <div className="inventory-page">
      <h1>Inventory / Stock</h1>

      <div className="inventory-card">
        <table>
          <thead>
            <tr>
              <th>Product Name</th>
              <th>Category</th>
              <th>Stock Qty</th>
              <th>Price</th>
              <th>Status</th>
            </tr>
          </thead>

          <tbody>
            {products.map((p) => (
              <tr key={p._id}>
                <td>{p.name}</td>
                <td>{p.category || "-"}</td>
                <td>{p.stock}</td>
                <td>₹{p.price}</td>
                <td>
                  {p.stock === 0 ? (
                    <span className="out">Out of Stock</span>
                  ) : p.stock < 10 ? (
                    <span className="low">Low Stock</span>
                  ) : (
                    <span className="in">In Stock</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
