const express = require("express");

const router = express.Router();

const {
  addExpense,
  getExpenses,
  deleteExpense,
  getDashboardSummary,
  updateExpense,
} = require("../controllers/expenseController");

router.post("/add", addExpense);
router.get("/", getExpenses);
router.get("/dashboard", getDashboardSummary);
router.put("/:id", updateExpense);
router.delete("/:id", deleteExpense);
module.exports = router;