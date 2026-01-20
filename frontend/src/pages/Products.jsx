import { useEffect, useState } from "react";
import api from "../api/api";
import "./Products.css";

export default function Products() {
  const [products, setProducts] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState(null);

  // ✅ SINGLE FORM STATE (IMPORTANT)
  const [form, setForm] = useState({
    name: "",
    sku: "",
    category: "",
    price: "",
    stock: "",
  });

  // ================= FETCH PRODUCTS =================
  const loadProducts = async () => {
    try {
      const res = await api.get("/products");
      setProducts(res.data);
    } catch (err) {
      console.error("Load products failed:", err);
    }
  };

  useEffect(() => {
    loadProducts();
  }, []);

  // ================= HANDLE INPUT =================
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // ================= SAVE / UPDATE =================
  const handleSave = async () => {
    const { name, sku, category, price, stock } = form;

    if (!name || !sku || !category || !price || !stock) {
      alert("All fields are required");
      return;
    }

    try {
      if (editingId) {
        // UPDATE
        await api.put(`/products/${editingId}`, form);
      } else {
        // CREATE ✅ SKU INCLUDED
        await api.post("/products", {
          name,
          sku,
          category,
          price: Number(price),
          stock: Number(stock),
        });
      }

      // RESET FORM
      setForm({
        name: "",
        sku: "",
        category: "",
        price: "",
        stock: "",
      });

      setEditingId(null);
      setShowModal(false);
      loadProducts();
    } catch (err) {
      console.error("Save failed:", err.response?.data || err.message);
      alert("Save failed. Check backend console.");
    }
  };

  // ================= EDIT =================
  const handleEdit = (product) => {
    setForm({
      name: product.name,
      sku: product.sku,
      category: product.category,
      price: product.price,
      stock: product.stock,
    });
    setEditingId(product._id);
    setShowModal(true);
  };

  // ================= DELETE =================
  const handleDelete = async (id) => {
    if (window.confirm("Delete this product?")) {
      try {
        await api.delete(`/products/${id}`);
        loadProducts();
      } catch (err) {
        console.error("Delete failed:", err);
      }
    }
  };

  return (
    <div className="products-page">
      {/* HEADER */}
      <div className="products-header">
        <h1>Product Management</h1>
        <button
          className="add-btn"
          onClick={() => {
            setShowModal(true);
            setEditingId(null);
          }}
        >
          + Add Product
        </button>
      </div>

      {/* TABLE */}
      <table className="products-table">
        <thead>
          <tr>
            <th>#</th>
            <th>Name</th>
            <th>SKU</th>
            <th>Category</th>
            <th>Price ₹</th>
            <th>Stock</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>

        <tbody>
          {products.map((p, i) => (
            <tr key={p._id}>
              <td>{i + 1}</td>
              <td>{p.name}</td>
              <td>{p.sku}</td>
              <td>{p.category}</td>
              <td>{p.price}</td>
              <td>{p.stock}</td>
              <td className={p.stock > 0 ? "in-stock" : "out-stock"}>
                {p.stock > 0 ? "In Stock" : "Out"}
              </td>
              <td>
                <button className="edit-btn" onClick={() => handleEdit(p)}>
                  Edit
                </button>
                <button
                  className="delete-btn"
                  onClick={() => handleDelete(p._id)}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* MODAL */}
      {showModal && (
        <div className="modal-overlay">
          <div className="modal-box">
            <h2>{editingId ? "Edit Product" : "Add Product"}</h2>

            <input
              name="name"
              placeholder="Product Name"
              value={form.name}
              onChange={handleChange}
            />

            <input
              name="sku"
              placeholder="SKU"
              value={form.sku}
              onChange={handleChange}
            />

            <input
              name="category"
              placeholder="Category"
              value={form.category}
              onChange={handleChange}
            />

            <input
              type="number"
              name="price"
              placeholder="Price"
              value={form.price}
              onChange={handleChange}
            />

            <input
              type="number"
              name="stock"
              placeholder="Stock"
              value={form.stock}
              onChange={handleChange}
            />

            <div className="modal-actions">
              <button
                className="cancel-btn"
                onClick={() => {
                  setShowModal(false);
                  setEditingId(null);
                }}
              >
                Cancel
              </button>
              <button className="save-btn" onClick={handleSave}>
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
