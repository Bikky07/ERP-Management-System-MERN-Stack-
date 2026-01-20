import { useEffect, useState } from "react";
import api from "../api/api";
import "./Suppliers.css";

export default function Suppliers() {
  const [suppliers, setSuppliers] = useState([]);
  const [name, setName] = useState("");
  const [contact, setContact] = useState("");
  const [address, setAddress] = useState("");

  const loadSuppliers = async () => {
    try {
      const res = await api.get("/suppliers");
      setSuppliers(res.data);
    } catch (err) {
      console.error("Load suppliers failed", err);
    }
  };

  useEffect(() => {
    loadSuppliers();
  }, []);

  const addSupplier = async (e) => {
    e.preventDefault();

    if (!name || !contact) {
      alert("Name and contact required");
      return;
    }

    try {
      await api.post("/suppliers", {
        name,
        contact,
        address,
      });

      setName("");
      setContact("");
      setAddress("");
      loadSuppliers();
    } catch (err) {
      console.error("Add supplier failed", err);
    }
  };

  // ✅ DELETE SUPPLIER
  const deleteSupplier = async (id) => {
    if (!window.confirm("Delete this supplier?")) return;

    try {
      await api.delete(`/suppliers/${id}`);
      loadSuppliers();
    } catch (err) {
      console.error("Delete supplier failed", err);
      alert("Delete failed");
    }
  };

  return (
    <div className="supplier-page">
      <h1>Suppliers</h1>

      {/* ADD SUPPLIER FORM */}
      <form className="supplier-form" onSubmit={addSupplier}>
        <input
          placeholder="Supplier Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <input
          placeholder="Contact"
          value={contact}
          onChange={(e) => setContact(e.target.value)}
        />

        <input
          placeholder="Address"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
        />

        <button>Add Supplier</button>
      </form>

      {/* SUPPLIER TABLE */}
      <table className="supplier-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Contact</th>
            <th>Address</th>
            <th>Actions</th> 
          </tr>
        </thead>

        <tbody>
          {suppliers.map((s) => (
            <tr key={s._id}>
              <td>{s.name}</td>
              <td>{s.contact}</td>
              <td>{s.address || "-"}</td>
              <td>
                <button
                  className="btn-danger"
                  onClick={() => deleteSupplier(s._id)}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
