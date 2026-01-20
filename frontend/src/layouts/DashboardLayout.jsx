import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";
import "./DashboardLayout.css";

export default function DashboardLayout({ children }) {
  return (
    <div className="dashboard-layout">
      <Sidebar />

      <div className="dashboard-main">
        <Topbar />
        <div className="dashboard-content">{children}</div>
      </div>
    </div>
  );
}
