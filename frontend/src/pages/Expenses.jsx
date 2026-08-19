import { useState, useEffect } from "react";
import API from "../services/api";
import Layout from "../components/Layout";
import "../styles/Expenses.css";
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
    <div className="expense-page-header">
  <h1>Expense Management</h1>

  <p>
    Add, manage and track your daily expenses.
  </p>
</div>
<form
  onSubmit={handleSubmit}
  className="expense-form-card"
>
  <h3 className="expense-form-title">
    {editId
      ? "✏️ Update Expense"
      : "➕ Add New Expense"}
  </h3>

  <div className="expense-form-grid">

    {/* Amount */}
    <div className="expense-field">
      <label>Amount</label>

      <input
        type="number"
        name="amount"
        placeholder="Enter amount"
        value={formData.amount}
        onChange={handleChange}
        className="expense-input"
      />
    </div>

    {/* Category */}
    <div className="expense-field">
      <label>Category</label>

      <input
        type="text"
        name="category"
        placeholder="e.g. Food"
        value={formData.category}
        onChange={handleChange}
        className="expense-input"
      />
    </div>

    {/* Merchant */}
    <div className="expense-field">
      <label>Merchant</label>

      <input
        type="text"
        name="merchant"
        placeholder="e.g. Restaurant"
        value={formData.merchant}
        onChange={handleChange}
        className="expense-input"
      />
    </div>

    {/* Payment Method */}
    <div className="expense-field">
      <label>Payment Method</label>

      <select
        name="paymentMethod"
        value={formData.paymentMethod}
        onChange={handleChange}
        className="expense-select"
      >
        <option>Cash</option>
        <option>UPI</option>
        <option>Card</option>
      </select>
    </div>

    {/* Description */}
    <div className="expense-field full-width">
      <label>Description</label>

      <input
        type="text"
        name="description"
        placeholder="Add a short description"
        value={formData.description}
        onChange={handleChange}
        className="expense-input"
      />
    </div>

  </div>

  <div className="expense-submit-container">

    <button
      type="submit"
      className="expense-submit-btn"
    >
      {editId
        ? "Update Expense"
        : "Add Expense"}
    </button>

  </div>

</form>
<div className="expense-filter-bar">

  <div className="search-wrapper">
    <span className="search-icon">🔍</span>

    <input
      type="text"
      placeholder="Search by category..."
      value={search}
      onChange={(e) =>
        setSearch(e.target.value)
      }
      className="expense-search-input"
    />
  </div>

  <select
    value={filterCategory}
    onChange={(e) =>
      setFilterCategory(e.target.value)
    }
    className="expense-filter-select"
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
 <div className="expense-list-header">
  <div>
    <h2>Expense List</h2>
    <p>
      View and manage your recorded expenses.
    </p>
  </div>

  <span className="expense-count">
    {expenses.length} Expenses
  </span>
</div>
<div className="expense-table-container">

  <table className="expense-table">
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
  {(() => {
    const filteredExpenses = expenses
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
      );

    if (filteredExpenses.length === 0) {
      return (
        <tr>
          <td
            colSpan="5"
            className="no-expenses-found"
          >
            <div className="empty-expense-state">
              <div className="empty-expense-icon">
                🔍
              </div>

              <h3>No expenses found</h3>

              <p>
                Try changing your search or
                category filter.
              </p>
            </div>
          </td>
        </tr>
      );
    }

    return filteredExpenses.map(
      (expense) => (
        <tr key={expense._id}>

          <td className="expense-amount-cell">
            ₹{expense.amount}
          </td>

          <td className="expense-category-cell">
            <span className="expense-category-badge">
              🏷️ {expense.category}
            </span>
          </td>

          <td
            style={{
              padding: "12px",
              textAlign: "center",
            }}
          >
            {expense.description}
          </td>

          <td className="expense-payment-cell">
            <span className="expense-payment-badge">
              {expense.paymentMethod === "UPI"
                ? "📱"
                : expense.paymentMethod ===
                  "Card"
                ? "💳"
                : "💵"}

              {" "}

              {expense.paymentMethod}
            </span>
          </td>

          <td className="expense-actions-cell">

            <div className="expense-action-buttons">

              <button
                onClick={() =>
                  editExpense(expense)
                }
                className="edit-expense-btn"
              >
                ✏️ Edit
              </button>

              <button
                onClick={() =>
                  deleteExpense(expense._id)
                }
                className="delete-expense-btn"
              >
                🗑️ Delete
              </button>

            </div>

          </td>

        </tr>
      )
    );
  })()}
</tbody>
      </table>
      </div>
       </Layout>
  ); 
} 

export default Expenses;