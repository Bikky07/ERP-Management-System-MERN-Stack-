import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Products from "./pages/Products";
import Customers from "./pages/Customers";
import Grn from "./pages/Grn";
import Suppliers from "./pages/Suppliers";
import MainLayout from "./layouts/MainLayout";
import PurchaseOrders from "./pages/PurchaseOrders";
import Inventory from "./pages/Inventory";
import SalesOrders from "./pages/SalesOrders";
import Invoices from "./pages/Invoices";
import Reports from "./pages/Reports";
export default function App() {
  const token = localStorage.getItem("token");

  return (
    <BrowserRouter>
      <Routes>
        {/* ROOT REDIRECT */}
        <Route
          path="/"
          element={<Navigate to={token ? "/dashboard" : "/login"} />}
        />

        {/* LOGIN */}
        <Route path="/login" element={<Login />} />

        {/* PROTECTED ROUTES */}
        {token ? (
          <Route element={<MainLayout />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/products" element={<Products />} />
            <Route path="/customers" element={<Customers />} />
            <Route path="/grn" element={<Grn />} />
            <Route path="/inventory" element={<Inventory />} />
            <Route path="/suppliers" element={<Suppliers />} />
            <Route path="/purchase-orders" element={<PurchaseOrders />} />
             <Route path="/invoices" element={<Invoices />} />
            <Route path="/reports" element={<Reports />} />
           <Route path="/sales-orders" element={<SalesOrders />} />  
          </Route>
        ) : (
          /* BLOCK ALL OTHER ROUTES */
          <Route path="*" element={<Navigate to="/login" />} />
        )}
      </Routes>
    </BrowserRouter>
  );
}
