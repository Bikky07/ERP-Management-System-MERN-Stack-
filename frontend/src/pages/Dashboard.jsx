import { useEffect, useState } from "react";
import api from "../api/api";
import "./Dashboard.css";

export default function Dashboard() {
  const [stats, setStats] = useState({
    products: 0,
    customers: 0,
    salesOrders: 0,
    purchaseOrders: 0,
    invoices: 0,
    unpaidInvoices: 0,
    lowStock: 0,
  });

  useEffect(() => {
    loadDashboard();
  }, []);

  const loadDashboard = async () => {
    try {
      const [
        productsRes,
        customersRes,
        soRes,
        poRes,
        invRes,
      ] = await Promise.all([
        api.get("/products"),
        api.get("/customers"),
        api.get("/sales-orders"),
        api.get("/purchase-orders"),
        api.get("/invoices"),
      ]);

      const products = productsRes.data || [];
      const invoices = invRes.data || [];

      setStats({
        products: products.length,
        customers: customersRes.data?.length || 0,
        salesOrders: soRes.data?.length || 0,
        purchaseOrders: poRes.data?.length || 0,
        invoices: invoices.length,
        unpaidInvoices: invoices.filter(
          (i) => i.status === "Unpaid"
        ).length,
        lowStock: products.filter(
          (p) => p.stock > 0 && p.stock < 10
        ).length,
      });
    } catch (err) {
      console.error("Dashboard load error:", err);
    }
  };

  return (
    <div className="dashboard-page">
      <h1>Dashboard</h1>

      <div className="dashboard-grid">
        <div className="dash-card blue">
          <h3>Products</h3>
          <p>{stats.products}</p>
        </div>

        <div className="dash-card green">
          <h3>Customers</h3>
          <p>{stats.customers}</p>
        </div>

        <div className="dash-card purple">
          <h3>Sales Orders</h3>
          <p>{stats.salesOrders}</p>
        </div>

        <div className="dash-card orange">
          <h3>Purchase Orders</h3>
          <p>{stats.purchaseOrders}</p>
        </div>

        <div className="dash-card teal">
          <h3>Invoices</h3>
          <p>{stats.invoices}</p>
        </div>

        <div className="dash-card red">
          <h3>Unpaid Invoices</h3>
          <p>{stats.unpaidInvoices}</p>
        </div>

        <div className="dash-card yellow">
          <h3>Low Stock</h3>
          <p>{stats.lowStock}</p>
        </div>
      </div>
    </div>
  );
}
