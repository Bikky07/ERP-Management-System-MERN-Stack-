import { useEffect, useState } from "react";
import api from "../api/api";
import "./Customers.css";

export default function Customers() {
  const [customers, setCustomers] = useState([]);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");

  useEffect(() => {
    loadCustomers();
  }, []);

  const loadCustomers = async () => {
    try {
      const res = await api.get("/customers");
      setCustomers(res.data);
    } catch (err) {
      alert("Failed to load customers");
    }
  };

  const addCustomer = async () => {
    if (!name || !email) {
      alert("Name & Email required");
      return;
    }

    try {
      await api.post("/customers", { name, email, phone });
      setName("");
      setEmail("");
      setPhone("");
      loadCustomers();
    } catch (err) {
      alert("Customer create failed");
    }
  };

  const deleteCustomer = async (id) => {
    if (!window.confirm("Delete customer?")) return;

    try {
      await api.delete(`/customers/${id}`);
      loadCustomers();
    } catch (err) {
      alert("Delete failed");
    }
  };

  return (
    <div className="customers-page">
      <h1>Customers</h1>

      {/* ADD FORM */}
      <div className="customer-form">
        <input
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <input
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          placeholder="Phone"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
        />
        <button onClick={addCustomer}>Add</button>
      </div>

      {/* TABLE */}
      <div className="table-box">
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Phone</th>
              <th width="100">Action</th>
            </tr>
          </thead>
          <tbody>
            {customers.map((c) => (
              <tr key={c._id}>
                <td>{c.name}</td>
                <td>{c.email}</td>
                <td>{c.phone || "-"}</td>
                <td>
                  <button
                    className="danger-btn"
                    onClick={() => deleteCustomer(c._id)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
            {customers.length === 0 && (
              <tr>
                <td colSpan="4">No customers found</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
