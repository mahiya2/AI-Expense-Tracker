import { useState, useEffect } from "react";
import API from "../services/api";
import Layout from "../components/Layout";
import "../styles/Dashboard.css";

function Dashboard() {
  const [summary, setSummary] = useState({
    totalExpenses: 0,
    totalTransactions: 0,
    recentExpenses: [],
  });

  const [budget, setBudget] = useState(
    localStorage.getItem("budget") || ""
  );

  const fetchDashboardData = async () => {
    try {
      const res = await API.get(
        "/expenses/dashboard"
      );

      setSummary(res.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const saveBudget = () => {
    localStorage.setItem("budget", budget);
    alert("Budget Saved");
  };

  const remainingBudget =
    Number(budget || 0) -
    summary.totalExpenses;

  return (
    <Layout>
<div className="dashboard-header">
  <div className="dashboard-title-section">
    <span className="dashboard-label">
      💼 Expense Overview
    </span>

    <h1>Dashboard</h1>

    <p>
      Track your spending, budget and recent
      transactions in one place.
    </p>
  </div>

  <div className="dashboard-status">
    <span className="status-dot"></span>
    <span>Financial Overview</span>
  </div>
</div>
      {/* Summary Cards */}
      <div className="dashboard-cards">

        {/* Total Expenses */}
        <div className="dashboard-card">
          <div className="card-icon expense-icon">
            💰
          </div>

          <div className="card-content">
            <p>Total Expenses</p>
            <h2>
              ₹{summary.totalExpenses}
            </h2>
          </div>
        </div>

        {/* Transactions */}
        <div className="dashboard-card">
          <div className="card-icon transaction-icon">
            🧾
          </div>

          <div className="card-content">
            <p>Total Transactions</p>
            <h2>
              {summary.totalTransactions}
            </h2>
          </div>
        </div>

        {/* Budget */}
        <div className="dashboard-card budget-card">

  <div className="card-icon budget-icon">
    💵
  </div>

  <div className="card-content">
    <p>Monthly Budget</p>

    <div className="budget-input-wrapper">
      <span>₹</span>

      <input
        type="number"
        value={budget}
        onChange={(e) =>
          setBudget(e.target.value)
        }
        placeholder="Enter budget"
        className="budget-input"
      />
    </div>

    <button
      onClick={saveBudget}
      className="save-budget-btn"
    >
      Save Budget
    </button>
  </div>

</div>

        {/* Remaining Budget */}
        <div className="dashboard-card">
          <div className="card-icon remaining-icon">
            📊
          </div>

          <div className="card-content">
            <p>Remaining Budget</p>

            <h2
              className={
                remainingBudget < 0
                  ? "budget-danger"
                  : "budget-safe"
              }
            >
              ₹{remainingBudget}
            </h2>

            <span className="card-subtitle">
              Available to spend
            </span>
          </div>
        </div>

      </div>

      {/* Recent Expenses */}
      <div className="recent-expenses-section">

        <div className="section-header">
          <div>
            <h2>Recent Expenses</h2>
            <p>
              Your latest transactions
            </p>
          </div>
        </div>

        <div className="expense-table-container">

          <table className="expense-table">

            <thead>
              <tr>
                <th>Amount</th>
                <th>Category</th>
              </tr>
            </thead>

            <tbody>

              {summary.recentExpenses.length >
              0 ? (
                summary.recentExpenses.map(
                  (expense) => (
                    <tr key={expense._id}>

                      <td className="amount-cell">
                        ₹{expense.amount}
                      </td>

                      <td>
                        <span className="category-badge">
                          {expense.category}
                        </span>
                      </td>

                    </tr>
                  )
                )
              ) : (
                <tr>
                  <td
                    colSpan="2"
                    className="no-expenses"
                  >
                    No expenses found.
                  </td>
                </tr>
              )}

            </tbody>

          </table>

        </div>

      </div>

    </Layout>
  );
}

export default Dashboard;