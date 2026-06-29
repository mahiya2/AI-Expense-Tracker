import { useState, useEffect } from "react";
import API from "../services/api";
import Layout from "../components/Layout";

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
    const res = await API.get("/expenses/dashboard");

    setSummary(res.data);
  } catch (error) {
    console.log(error);
  }
};
  useEffect(() => {
    fetchDashboardData();
  }, []);

  const saveBudget = () => {
    localStorage.setItem(
      "budget",
      budget
    );

    alert("Budget Saved");
  };

  const remainingBudget =
    Number(budget || 0) -
    summary.totalExpenses;
  return (
    <Layout>
     <h1
  style={{
    color: "#1e293b",
    marginBottom: "30px",
  }}
>
  Dashboard
</h1>

      <div
        style={{
          display: "flex",
          gap: "20px",
          marginTop: "20px",
          flexWrap: "wrap",
        }}
      >
        <div
        style={{
  background: "#ffffff",
  padding: "25px",
  borderRadius: "15px",
  width: "260px",
  minHeight: "180px",
  boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
}}
        >
          <h3
  style={{
    marginBottom: "20px",
  }}
>
  Total Expenses
</h3>

<h2>
  ₹{summary.totalExpenses}
</h2>
        </div>

        <div
          style={{
  background: "#ffffff",
  padding: "25px",
  borderRadius: "15px",
  width: "260px",
  minHeight: "180px",
  boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
}}
        >
          <h3 style={{
    marginBottom: "20px",
  }}>Total Transactions</h3>

          <h2>
            {summary.totalTransactions}
          </h2>
        </div>

        <div
        style={{
  background: "#ffffff",
  padding: "25px",
  borderRadius: "15px",
  width: "260px",
  minHeight: "180px",
  boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
}}
        >
          <h3 style={{
    marginBottom: "20px",
  }}>Budget</h3>

        <input
  type="number"
  value={budget}
  onChange={(e) =>
    setBudget(e.target.value)
  }
  placeholder="Enter Budget"
  style={{
    width: "100%",
    padding: "10px",
    borderRadius: "8px",
    border: "1px solid #ccc",
  }}
/>
          <br />
  <div
  style={{
    display: "flex",
    justifyContent: "center",
    marginTop: "15px",
    marginBottom: "15px",
  }}
>
  <button
    onClick={saveBudget}
    style={{
      background: "#2563eb",
      color: "white",
      border: "none",
      padding: "10px 15px",
      borderRadius: "8px",
      cursor: "pointer",
    }}
  >
    Save Budget
  </button>
</div>

          <h4 style={{
            marginBottom: "15px"
    //marginTop: "15px",
  }}>
            Remaining: ₹
            {remainingBudget}
          </h4>
        </div>
      </div>

      <h2
        style={{
          marginTop: "40px",
        }}
      >
        Recent Expenses
      </h2>

     <table
  style={{
    width: "100%",
    background: "#fff",
    borderCollapse: "collapse",
    borderRadius: "10px",
  }}
>
        <thead
  style={{
    background: "#dbeafe",
  }}
>
          <tr>
           <th
  style={{
    padding: "15px",
    textAlign: "center",
  }}
>
  Amount
</th>

<th
  style={{
    padding: "15px",
    textAlign: "center",
  }}
>
  Category
</th>
          </tr>
        </thead>

        <tbody>
          {summary.recentExpenses.map(
            (expense) => (
              <tr
  key={expense._id}
  style={{
    borderBottom: "1px solid #e5e7eb",
  }}
>
               <td
  style={{
    padding: "15px",
    textAlign: "center",
  }}
>
  ₹{expense.amount}
</td>

<td
  style={{
    padding: "15px",
    textAlign: "center",
  }}
>
  {expense.category}
</td>
              </tr>
            )
          )}
        </tbody>
      </table>
    </Layout>
  );
}

export default Dashboard;