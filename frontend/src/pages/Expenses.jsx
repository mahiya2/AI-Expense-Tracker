import { useState, useEffect } from "react";
import API from "../services/api";
import Layout from "../components/Layout";
function Expenses() {
  const [formData, setFormData] = useState({
    amount: "",
    category: "",
    merchant: "",
    description: "",
    paymentMethod: "Cash",
  });

  const [expenses, setExpenses] = useState([]);
  const [editId, setEditId] = useState(null);
  const [search, setSearch] = useState("");
  const [filterCategory, setFilterCategory] = useState("");
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

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
const handleSubmit = async (e) => {
  e.preventDefault();

  try {
    const user = JSON.parse(
      localStorage.getItem("user")
    );

    if (editId) {
      await API.put(`/expenses/${editId}`, {
        ...formData,
      });

      alert("Expense Updated Successfully");
    } else {
    await API.post("/expenses/add", {
  userId: user.id,
  ...formData,
  category:
    formData.category.charAt(0).toUpperCase() +
    formData.category.slice(1).toLowerCase(),
});

      alert("Expense Added Successfully");
    }

    fetchExpenses();

    setFormData({
      amount: "",
      category: "",
      merchant: "",
      description: "",
      paymentMethod: "Cash",
    });

    setEditId(null);

  } catch (error) {
    console.log(error);

    alert(
      error.response?.data?.message ||
      error.message
    );
  }
};

 
const deleteExpense = async (id) => {

  const confirmDelete =
    window.confirm(
      "Are you sure you want to delete this expense?"
    );

  if (!confirmDelete) return;

  try {
    await API.delete(`/expenses/${id}`);

    alert("Expense Deleted");

    fetchExpenses();

  } catch (error) {
    console.log(error);
  }
};
const editExpense = (expense) => {
  setFormData({
    amount: expense.amount,
    category: expense.category,
    merchant: expense.merchant,
    description: expense.description,
    paymentMethod: expense.paymentMethod,
  });

  setEditId(expense._id);
};
  return (
    <Layout>
      <h1>Expense Management</h1>

     <form
  onSubmit={handleSubmit}
  style={{
    background: "#fff",
    padding: "25px",
    borderRadius: "12px",
    boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
    width: "400px",
   margin: "0 auto 30px auto",
  }}
><h3
  style={{
    textAlign: "center",
    marginBottom: "20px",
  }}
>
  Add Expense
</h3>

        <input
  type="number"
  name="amount"
  placeholder="Amount"
  value={formData.amount}
  onChange={handleChange}
  style={{
    width: "300px",
    padding: "12px",
    borderRadius: "8px",
    border: "1px solid #ccc",
  }}
/>
        <br /><br />

        <input
  type="text"
  name="category"
  placeholder="Category"
  value={formData.category}
  onChange={handleChange}
  style={{
    width: "300px",
    padding: "12px",
    borderRadius: "8px",
    border: "1px solid #ccc",
  }}
/>
        <br /><br />

       <input
  type="text"
  name="merchant"
  placeholder="Merchant"
  value={formData.merchant}
  onChange={handleChange}
  style={{
    width: "300px",
    padding: "12px",
    borderRadius: "8px",
    border: "1px solid #ccc",
  }}
/>

        <br /><br />
<input
  type="text"
  name="description"
  placeholder="Description"
  value={formData.description}
  onChange={handleChange}
  style={{
    width: "300px",
    padding: "12px",
    borderRadius: "8px",
    border: "1px solid #ccc",
  }}
/>
        <br /><br />

       <select
  name="paymentMethod"
  value={formData.paymentMethod}
  onChange={handleChange}
  style={{
    display: "block",
    margin: "0 auto",
    padding: "8px",
  }}
>
          <option>Cash</option>
          <option>UPI</option>
          <option>Card</option>
        </select>

        <br /><br />

<div
  style={{
    display: "flex",
    justifyContent: "center",
  }}
>
  <button
    type="submit"
    style={{
      background: "#2563eb",
      color: "white",
      border: "none",
      padding: "12px 20px",
      borderRadius: "8px",
      cursor: "pointer",
    }}
  >
    {editId ? "Update Expense" : "Add Expense"}
  </button>
</div>
      </form><div
  style={{
    display: "flex",
    justifyContent: "center",
    gap: "10px",
    marginBottom: "20px",
  }}
>
       <input
  type="text"
  placeholder="Search by category..."
  value={search}
  onChange={(e) => setSearch(e.target.value)}
  style={{
    width: "350px",
    padding: "12px",
    borderRadius: "8px",
    border: "1px solid #ccc",
  }}
/>
<select
  value={filterCategory}
  onChange={(e) =>
    setFilterCategory(e.target.value)
  }
  style={{
    padding: "10px",
    marginLeft: "10px",
  }}
>
  <option value="">
    All Categories
  </option>

  <option value="Food">
    Food
  </option>

  <option value="Travel">
    Travel
  </option>

  <option value="Shopping">
    Shopping
  </option>

  <option value="Loan">
    Loan
  </option>
</select>
</div>
     <h2
  style={{
    textAlign: "center",
    marginTop: "20px",
    marginBottom: "20px",
    color: "#1e293b",
  }}
>

  Expense List
</h2>

      <table
  style={{
    width: "90%",
margin: "0 auto",
    borderCollapse: "collapse",
    marginTop: "20px",
    background: "white",
  }}
>
       <thead
  style={{
    background: "#e2e8f0",
  }}
>
          <tr>
         <th style={{ padding: "15px", textAlign: "center" }}>
  Amount
</th>

<th style={{ padding: "15px", textAlign: "center" }}>
  Category
</th>

<th style={{ padding: "15px", textAlign: "center" }}>
  Description
</th>

<th style={{ padding: "15px", textAlign: "center" }}>
  Payment
</th>

<th style={{ padding: "15px", textAlign: "center" }}>
  Action
</th>
          </tr>
        </thead>

        <tbody>
          {expenses
  .filter((expense) =>
    expense.category
      .toLowerCase()
      .includes(search.toLowerCase())
  )
  .filter(
  (expense) =>
    filterCategory === "" ||
    expense.category.toLowerCase() ===
      filterCategory.toLowerCase()
)
  .map((expense) => (
            <tr key={expense._id}>
 <td style={{ padding: "12px", textAlign: "center" }}>
  ₹{expense.amount}
</td>

<td style={{ padding: "12px", textAlign: "center" }}>
  {expense.category}
</td>

<td style={{ padding: "12px", textAlign: "center" }}>
  {expense.description}
</td>

<td style={{ padding: "12px", textAlign: "center" }}>
  {expense.paymentMethod}
</td>

<td
  style={{
    padding: "12px",
    textAlign: "center",
  }}
>
  {/* Edit Button */}

  <button
    onClick={() => editExpense(expense)}
    style={{
      background: "#f59e0b",
      color: "white",
      border: "none",
      padding: "8px 12px",
      borderRadius: "6px",
      cursor: "pointer",
    }}
  >
    Edit
  </button>

  <button
    onClick={() => deleteExpense(expense._id)}
    style={{
      background: "#ef4444",
      color: "white",
      border: "none",
      padding: "8px 12px",
      borderRadius: "6px",
      cursor: "pointer",
      marginLeft: "5px",
    }}
  >
    Delete
  </button>
</td>
</tr>
          ))}
        </tbody>
      </table>
       </Layout>
  ); 
} 

export default Expenses;