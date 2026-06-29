import { Link } from "react-router-dom";
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

  return (
    <div
      style={{
        display: "flex",
        minHeight: "100vh",
   backgroundColor: "#eef2ff",
      }}
    >
      {/* Sidebar */}
      <div
        style={{
          width: "260px",
          background: "#0f172a",
          color: "white",
          padding: "25px",
          boxShadow: "2px 0px 10px rgba(0,0,0,0.1)",
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
       <Link
  to="/dashboard"
  style={{
    textDecoration: "none",
    color: "white",
  }}
>
  <FaTachometerAlt
    style={{ marginRight: "10px" }}
  />
  Dashboard
</Link>

          <Link
            to="/expenses"
            style={{
              textDecoration: "none",
              color: "white",
            }}
          >
          <FaMoneyBillWave
  style={{ marginRight: "10px" }}
/>
Expenses
          </Link>

          <Link
            to="/analytics"
            style={{
              textDecoration: "none",
              color: "white",
            }}
          >
            <FaChartPie
  style={{ marginRight: "10px" }}
/>
Analytics
          </Link>

          <Link
            to="/ai"
            style={{
              textDecoration: "none",
              color: "white",
            }}
          ><FaRobot
  style={{ marginRight: "10px" }}
/>
AI Assistant
          </Link>
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