import { NavLink } from "react-router-dom";
import {
  FaTachometerAlt,
  FaMoneyBillWave,
  FaChartPie,
  FaRobot,
  FaSignOutAlt,
} from "react-icons/fa";
function Layout({ children }) {
  const handleLogout = () => {
    localStorage.clear();
    window.location.href = "/";
  };
  const navLinkStyle = ({ isActive }) => ({
    textDecoration: "none",
    color: "#cbd5e1",
    padding: "12px",
    borderRadius: "10px",
    background: isActive
      ? "#2563eb"
      : "transparent",
    display: "flex",
    alignItems: "center",
    transition: "0.2s",
  });
  return (
<div
  style={{
    display: "flex",
    minHeight: "100vh",
   background:
  "linear-gradient(135deg, #eef2ff, #e0f2fe, #f3e8ff)",
    backgroundSize: "200% 200%",
    animation: "backgroundMove 12s ease infinite",
  }}
>
      {/* Sidebar */}
 <div
  style={{
    width: "260px",
    background: "#020617",
    color: "#f8fafc",
    padding: "25px",
    boxShadow: "2px 0px 10px rgba(0,0,0,0.3)",
  }}
>
        <h2
          style={{
            textAlign: "center",
            marginBottom: "30px",
          }}
        >
          Expense Tracker
        </h2>

        <hr
          style={{
            borderColor: "#334155",
          }}
        />

        <div
          style={{
            marginTop: "20px",
            display: "flex",
            flexDirection: "column",
            gap: "15px",
          }}
        >
    <NavLink
  to="/dashboard"
  style={navLinkStyle}
className="sidebar-link"
>
  <FaTachometerAlt
    style={{ marginRight: "10px" }}
  />
  Dashboard
</NavLink>
<NavLink
  to="/expenses"
  style={navLinkStyle}
className="sidebar-link"
>
  <FaMoneyBillWave
    style={{ marginRight: "10px" }}
  />
  Expenses
</NavLink>

<NavLink
  to="/analytics"
  style={navLinkStyle}
className="sidebar-link"
>

  <FaChartPie
    style={{ marginRight: "10px" }}
  />
  Analytics
</NavLink>
<NavLink
  to="/ai"
  style={navLinkStyle}
className="sidebar-link"
>
  <FaRobot
    style={{ marginRight: "10px" }}
  />
  AI Assistant
</NavLink>
        </div>

        <button
          onClick={handleLogout}
          style={{
            marginTop: "40px",
            width: "100%",
            padding: "12px",
            border: "none",
            borderRadius: "8px",
            cursor: "pointer",
            background: "#ef4444",
            color: "white",
            fontWeight: "bold",
          }}
        >
          
        <>
        
  <FaSignOutAlt
    style={{ marginRight: "8px" }}
  />
  Logout
</>
        </button>
      </div>

      {/* Main Content */}
      <div
        style={{
          flex: 1,
          padding: "30px",
        }}
      >
        {children}
      </div>
    </div>
  );
}

export default Layout;