# 💰 AI Expense Tracker

An AI-powered full-stack expense management application built using the MERN stack. It allows users to securely manage their expenses, track budgets, analyze spending patterns, and interact with an AI assistant for personalized expense insights.

---

## 📌 Project Overview

The AI Expense Tracker is designed to make personal expense management easier and more intelligent.

Users can create an account, securely log in, add and manage expenses, track their spending, view analytical charts, and interact with an AI-powered assistant.

The application combines traditional expense management features with AI-based natural language interaction.

---

## 🚀 Features

### 🔐 User Authentication

- User registration
- User login
- JWT-based authentication
- Protected API routes
- Logout functionality
- Secure password hashing using bcrypt

### 💸 Expense Management

- Add new expenses
- View expenses
- Edit expenses
- Delete expenses
- Search expenses
- Filter expenses by category
- Track payment methods
- Store expense descriptions and merchants

### 📊 Dashboard

The dashboard provides an overview of the user's financial activity.

It displays:

- Total amount spent
- Number of transactions
- Budget information
- Remaining budget
- Recent expenses

### 📈 Expense Analytics

The analytics section helps users understand their spending patterns using visual charts.

It includes:

- **Pie Chart** — Category-wise spending distribution
- **Bar Chart** — Comparison of spending across categories
- **Line Chart** — Monthly expense trends

### 🤖 AI Expense Assistant

The application includes an AI-powered conversational assistant.

Users can ask questions such as:

- How much did I spend on Food?
- What is my highest expense?
- What is my total spending?
- Which category do I spend the most on?
- How can I reduce my spending?
- Give me a summary of my expenses.

The assistant can also understand natural-language expense entries such as:

> I spent ₹500 on Food.

This allows users to interact with the expense tracker more naturally.

### 💰 Budget Tracking

Users can set and track their spending budget.

The application calculates:

```text
Remaining Budget = Total Budget - Total Expenses