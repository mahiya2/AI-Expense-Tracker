import { useState, useEffect } from "react";
import API from "../services/api";
import Layout from "../components/Layout";
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

  const COLORS = [
    "#0088FE",
    "#00C49F",
    "#FFBB28",
    "#FF8042",
    "#AF19FF",
  ];
  return (
<Layout>
     <h1
  style={{
    color: "#1e293b",
    marginBottom: "30px",
  }}
>
  Expense Analytics
</h1>
<div
  style={{
    display: "flex",
    gap: "30px",
    flexWrap: "wrap",
    justifyContent: "center",
  }}
>
  {/* Pie Chart Card */}
  <div
    style={{
      background: "#fff",
      padding: "20px",
      borderRadius: "15px",
      boxShadow:
        "0 4px 12px rgba(0,0,0,0.08)",
    }}
  >
    <h3
      style={{
        textAlign: "center",
      }}
    >
      Category Distribution
    </h3>

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
  <div
    style={{
      background: "#fff",
      padding: "20px",
      borderRadius: "15px",
      boxShadow:
        "0 4px 12px rgba(0,0,0,0.08)",
    }}
  >
    <h3
      style={{
        textAlign: "center",
      }}
    >
      Category Comparison
    </h3>

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
<div
  style={{
    marginTop: "40px",
    background: "#fff",
    padding: "20px",
    borderRadius: "15px",
    boxShadow:
      "0 4px 12px rgba(0,0,0,0.08)",
  }}
>
  <h3
    style={{
      textAlign: "center",
      marginBottom: "20px",
    }}
  >
    Monthly Expense Trend
  </h3>

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