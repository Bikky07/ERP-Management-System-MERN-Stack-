import { useEffect, useState } from "react";
import api from "../api/api";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import "./Reports.css";

export default function Reports() {
  const [reportType, setReportType] = useState("sales");
  const [rows, setRows] = useState([]);
  const [summary, setSummary] = useState({});
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");

  useEffect(() => {
    fetchReport();
  }, [reportType]);

  const fetchReport = async () => {
    try {
      const res = await api.get(`/reports/${reportType}`, {
        params: { from, to },
      });

      if (reportType === "sales") {
        setRows(res.data.orders || []);
        setSummary({
          totalOrders: res.data.totalOrders,
          totalRevenue: res.data.totalRevenue,
        });
      }

      if (reportType === "purchase") {
        setRows(res.data.purchases || []);
        setSummary({
          totalPurchases: res.data.totalPurchases,
          totalCost: res.data.totalCost,
        });
      }

      if (reportType === "inventory") {
        setRows(res.data.products || []);
        setSummary({
          totalProducts: res.data.totalProducts,
          lowStock: res.data.lowStock,
        });
      }
    } catch (err) {
      console.error("Report error:", err);
      setRows([]);
      setSummary({});
    }
  };

  // EXPORT TO EXCEL
  const exportExcel = () => {
    if (!rows.length) return alert("No data to export");

    const ws = XLSX.utils.json_to_sheet(rows);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Report");

    const excelData = XLSX.write(wb, {
      bookType: "xlsx",
      type: "array",
    });

    saveAs(
      new Blob([excelData], { type: "application/octet-stream" }),
      `${reportType}-report.xlsx`
    );
  };

  return (
    <div className="reports-page">
      <div className="reports-card">
        <div className="reports-header">
          <h2>📊 Reports</h2>
          <button onClick={exportExcel} className="export-btn">
            Export Excel
          </button>
        </div>

        {/* FILTERS */}
        <div className="reports-filter">
          <select value={reportType} onChange={(e) => setReportType(e.target.value)}>
            <option value="sales">Sales</option>
            <option value="purchase">Purchase</option>
            <option value="inventory">Inventory</option>
          </select>

          <input type="date" value={from} onChange={(e) => setFrom(e.target.value)} />
          <input type="date" value={to} onChange={(e) => setTo(e.target.value)} />

          <button onClick={fetchReport}>Apply</button>
        </div>

        {/* SUMMARY */}
        <div className="report-summary">
          {Object.entries(summary).map(([k, v]) => (
            <div key={k}>
              <h4>{k}</h4>
              <p>{v}</p>
            </div>
          ))}
        </div>

        {/* TABLE */}
        <div className="reports-table-wrapper">
          <table className="reports-table">
            <thead>
              <tr>
                {rows.length > 0 &&
                  Object.keys(rows[0]).map((key) => (
                    <th key={key}>{key}</th>
                  ))}
              </tr>
            </thead>
            <tbody>
              {rows.map((row, i) => (
                <tr key={i}>
                  {Object.values(row).map((val, j) => (
                    <td key={j}>
                      {typeof val === "object"
                        ? JSON.stringify(val)
                        : String(val)}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>

          {!rows.length && <p className="no-data">No data</p>}
        </div>
      </div>
    </div>
  );
}
