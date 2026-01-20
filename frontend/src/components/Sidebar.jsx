import { NavLink } from "react-router-dom";

export default function Sidebar() {
  return (
    <div className="sidebar">
      <h2>ERP System</h2>

      <NavLink to="/dashboard">Dashboard</NavLink>
      <NavLink to="/products">Products</NavLink>
      <NavLink to="/customers">Customers</NavLink>
      <NavLink to="/grn">GRN</NavLink>
      <NavLink to="/suppliers">Suppliers</NavLink>
      <NavLink to="/purchase-orders">Purchase Orders</NavLink>
      <NavLink to="/sales-orders">Sales Orders</NavLink>
      <NavLink to="/invoices">Invoices</NavLink>
     <NavLink to="/reports">Reports</NavLink>

    </div>
  );
}
