import { useState, useEffect } from "react";
import API from "../services/api";
import Layout from "../components/Layout";
import "../styles/Analytics.css";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  LineChart,
  Line,
} from "recharts";

function Analytics() {
  const [expenses, setExpenses] = useState([]);
const fetchExpenses = async () => {
  try {
    const res = await API.get("/expenses");

    setExpenses(res.data);

  } catch (error) {
    console.log(error);
  }
};

  useEffect(() => {
    fetchExpenses();
  }, []);

  const categoryData = Object.values(
    expenses.reduce((acc, expense) => {
     const category =
  expense.category.charAt(0).toUpperCase() +
  expense.category.slice(1).toLowerCase();

if (!acc[category]) {
  acc[category] = {
    name: category,
    value: 0,
  };
}

acc[category].value += Number(
  expense.amount
);
      return acc;
    }, {})
  );
  
  const monthlyData = Object.values(
  expenses.reduce((acc, expense) => {
    const month = new Date(
      expense.createdAt
    ).toLocaleString("default", {
      month: "short",
    });

    if (!acc[month]) {
      acc[month] = {
        month,
        total: 0,
      };
    }

    acc[month].total += Number(
      expense.amount
    );

    return acc;
  }, {})
);
const totalExpenses = expenses.reduce(
  (sum, expense) =>
    sum + Number(expense.amount),
  0
);

const totalTransactions = expenses.length;

const totalCategories = categoryData.length;
  const COLORS = [
    "#0088FE",
    "#00C49F",
    "#FFBB28",
    "#FF8042",
    "#AF19FF",
  ];
  return (
<Layout>
<div className="analytics-header">
  <div>
    <span className="analytics-label">
      📊 Financial Insights
    </span>

    <h1>Expense Analytics</h1>

    <p>
      Understand your spending patterns and
      track your expenses over time.
    </p>
  </div>
</div>
<div className="analytics-summary-cards">

  {/* Total Spent */}
  <div className="analytics-summary-card">
    <div className="summary-card-icon">
      💰
    </div>

    <div>
      <p>Total Spent</p>
      <h2>₹{totalExpenses}</h2>
    </div>
  </div>

  {/* Total Transactions */}
  <div className="analytics-summary-card">
    <div className="summary-card-icon">
      🧾
    </div>

    <div>
      <p>Total Transactions</p>
      <h2>{totalTransactions}</h2>
    </div>
  </div>
{/* Total Categories */}
<div className="analytics-summary-card">
  <div className="summary-card-icon">
    🏷️
  </div>

  <div>
    <p>Categories</p>
    <h2>{totalCategories}</h2>
  </div>
</div>
</div>
<div className="analytics-chart-section">
  {/* Pie Chart Card */}
<div className="analytics-chart-card">
  <div className="chart-card-header">
  <h3>Category Distribution</h3>

  <span>
    Spending by category
  </span>
</div>

    <PieChart
      width={400}
      height={350}
    >
      <Pie
        data={categoryData}
        cx="50%"
        cy="50%"
        outerRadius={100}
        dataKey="value"
        label
      >
        {categoryData.map(
          (entry, index) => (
            <Cell
              key={index}
              fill={
                COLORS[
                  index %
                    COLORS.length
                ]
              }
            />
          )
        )}
      </Pie>

      <Tooltip />
      <Legend />
    </PieChart>
  </div>

  {/* Bar Chart Card */}
  <div className="analytics-chart-card">
   <div className="chart-card-header">
  <h3>Category Comparison</h3>

  <span>
    Compare your spending
  </span>
</div>

    <BarChart
      width={450}
      height={350}
      data={categoryData}
    >
      <CartesianGrid strokeDasharray="3 3" />

      <XAxis dataKey="name" />

      <YAxis />

      <Tooltip />

      <Legend />

      <Bar
  dataKey="value"
  fill="#2563eb"
/>
    </BarChart>
  </div>
</div>
<div className="analytics-trend-card">
<div className="chart-card-header">
  <h3>Monthly Expense Trend</h3>

  <span>
    Track how your spending changes over time
  </span>
</div>

<LineChart
  width={700}
  height={350}
  data={monthlyData}
>
  <CartesianGrid strokeDasharray="3 3" />

  <XAxis dataKey="month" />

  <YAxis />

  <Tooltip />

  <Legend />

  <Line
  type="monotone"
  dataKey="total"
  name="Expenses"
  stroke="#2563eb"
  strokeWidth={3}
/>
</LineChart>
</div>
    </Layout>
  );
}

export default Analytics;