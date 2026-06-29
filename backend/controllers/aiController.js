const Groq = require("groq-sdk");
const Expense = require("../models/Expense");

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

const chatWithAI = async (req, res) => {
  try {
const {
  message,
  userId,
  budget,
} = req.body;

    const lowerMessage = message.toLowerCase();

    // Food Expenses Query
  // Dynamic Category Query
if (lowerMessage.includes("how much")) {
  const expenses = await Expense.find({ userId });

  const categories = [
    ...new Set(
      expenses.map((expense) =>
        expense.category.toLowerCase()
      )
    ),
  ];

  const matchedCategory = categories.find(
    (category) =>
      lowerMessage.includes(category)
  );

  if (matchedCategory) {
    const categoryExpenses =
      expenses.filter(
        (expense) =>
          expense.category.toLowerCase() ===
          matchedCategory
      );

    const total =
      categoryExpenses.reduce(
        (sum, expense) =>
          sum + expense.amount,
        0
      );

    return res.json({
      reply: `You have spent ₹${total} on ${matchedCategory}.`,
    });
  }
}
    // Total Expenses Query
    if (
      lowerMessage.includes("total expenses") ||
      lowerMessage.includes("total spending")
    ) {
      const expenses = await Expense.find({
        userId,
      });

      const total = expenses.reduce(
        (sum, expense) => sum + expense.amount,
        0
      );

      return res.json({
        reply: `Your total expenses are ₹${total}.`,
      });
    }

    // Recent Expenses Query
    if (
      lowerMessage.includes("recent expenses")
    ) {
      const recentExpenses =
        await Expense.find({ userId })
          .sort({ createdAt: -1 })
          .limit(5);

      const formatted = recentExpenses
        .map(
          (expense) =>
            `${expense.category} - ₹${expense.amount}`
        )
        .join("\n");

      return res.json({
        reply:
          "Recent Expenses:\n\n" +
          formatted,
      });
    }
// Spending Insights
if (
  lowerMessage.includes("insights") ||
  lowerMessage.includes("analysis")
) {
  const expenses = await Expense.find({
    userId,
  });

  if (expenses.length === 0) {
    return res.json({
      reply: "No expenses found.",
    });
  }

  const totalExpenses = expenses.reduce(
    (sum, expense) => sum + expense.amount,
    0
  );

  const categoryTotals = {};

  expenses.forEach((expense) => {
    if (!categoryTotals[expense.category]) {
      categoryTotals[expense.category] = 0;
    }

    categoryTotals[expense.category] +=
      expense.amount;
  });

  const highestCategory =
    Object.keys(categoryTotals).reduce(
      (a, b) =>
        categoryTotals[a] >
        categoryTotals[b]
          ? a
          : b
    );

  return res.json({
    reply:
      ` Spending Insights\n\n` +
      `Total Expenses: ₹${totalExpenses}\n\n` +
      `Highest Category: ${highestCategory} (₹${categoryTotals[highestCategory]})\n\n` +
      `Suggestion: Try reducing spending in your highest category.`,
  });
}
// Delete Last Expense
if (
  lowerMessage.includes("delete") &&
  lowerMessage.includes("last expense")
) {
  const lastExpense =
    await Expense.findOne({ userId })
      .sort({ createdAt: -1 });

  if (!lastExpense) {
    return res.json({
      reply: "No expenses found.",
    });
  }

  await Expense.findByIdAndDelete(
    lastExpense._id
  );

  return res.json({
    reply:
      `Deleted ${lastExpense.category} expense of ₹${lastExpense.amount}.`,
  });
}
// Update Last Expense
if (
  lowerMessage.includes("change") &&
  lowerMessage.includes("last expense")
) {
  const amountMatch =
    lowerMessage.match(/\d+/);

  if (!amountMatch) {
    return res.json({
      reply:
        "Please provide a valid amount.",
    });
  }

  const newAmount =
    Number(amountMatch[0]);

  const lastExpense =
    await Expense.findOne({ userId })
      .sort({ createdAt: -1 });

  if (!lastExpense) {
    return res.json({
      reply: "No expenses found.",
    });
  }

  const oldAmount =
    lastExpense.amount;

  lastExpense.amount =
    newAmount;

  await lastExpense.save();

  return res.json({
    reply:
      `Updated last expense from ₹${oldAmount} to ₹${newAmount}.`,
  });
}
// Budget Remaining Query
if (
  lowerMessage.includes("budget") &&
  lowerMessage.includes("left")
) {
  const expenses = await Expense.find({
    userId,
  });
  const totalExpenses =
    expenses.reduce(
      (sum, expense) =>
        sum + expense.amount,
      0
    );
  const remaining =
    Number(budget) -
    totalExpenses;

  return res.json({
    reply:
      `Your budget is ₹${budget}.\n` +
      `Remaining budget is ₹${remaining}.`,
  });
}
// Highest Spending Category Query
if (
  lowerMessage.includes("highest spending category") ||
  lowerMessage.includes("highest category")
) {
  const expenses = await Expense.find({
    userId,
  });

  if (expenses.length === 0) {
    return res.json({
      reply: "No expenses found.",
    });
  }

  const categoryTotals = {};

  expenses.forEach((expense) => {
    if (!categoryTotals[expense.category]) {
      categoryTotals[expense.category] = 0;
    }

    categoryTotals[expense.category] +=
      expense.amount;
  });

  const highestCategory =
    Object.keys(categoryTotals).reduce(
      (a, b) =>
        categoryTotals[a] >
        categoryTotals[b]
          ? a
          : b
    );

  return res.json({
    reply:
      `Your highest spending category is ${highestCategory} (₹${categoryTotals[highestCategory]}).`,
  });
}
    // Groq AI Call
    const completion =
      await groq.chat.completions.create({
        messages: [
          {
            role: "system",
            content: `
You are an expense extraction assistant.

Extract expense information and return ONLY valid JSON.

Example:

Input:
I spent 500 on food

Output:
{
  "amount": 500,
  "category": "Food"
}
            `,
          },
          {
            role: "user",
            content: message,
          },
        ],
        model: "llama-3.3-70b-versatile",
      });

    const reply =
      completion.choices[0].message.content;

    try {
      const expenseData = JSON.parse(
        reply
          .replace(/```json|```/g, "")
          .trim()
      );

      if (
        expenseData.amount &&
        expenseData.category
      ) {
        const expense =
          await Expense.create({
            userId,
            amount: expenseData.amount,
            category:
              expenseData.category,
            merchant: "",
            description:
              "Added via AI",
            paymentMethod: "Cash",
          });

        return res.json({
          reply: `Added ₹${expense.amount} expense in ${expense.category} category.`,
        });
      }
    } catch (err) {
      console.log("JSON Parse Error");
    }

    res.json({ reply });

  } catch (error) {
    console.log(error);

    res.status(500).json({
      message: "AI Error",
    });
  }
};

module.exports = {
  chatWithAI,
};