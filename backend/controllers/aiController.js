const Groq = require("groq-sdk");
const Expense = require("../models/Expense");

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

const chatWithAI = async (req, res) => {
  try {
   const { message, budget } = req.body;

const userId = req.user.id;

    if (!message || !userId) {
      return res.status(400).json({
        message: "Message and userId are required",
      });
    }

    // --------------------------------------------------
    // 1. GET USER EXPENSES FROM MONGODB
    // --------------------------------------------------

    const expenses = await Expense.find({ userId })
      .sort({ createdAt: -1 });

    // --------------------------------------------------
    // 2. CALCULATE BASIC EXPENSE SUMMARY
    // --------------------------------------------------

    const totalExpenses = expenses.reduce(
      (sum, expense) =>
        sum + Number(expense.amount),
      0
    );

    const remainingBudget =
      Number(budget || 0) - totalExpenses;

    // --------------------------------------------------
    // 3. CATEGORY SUMMARY
    // --------------------------------------------------

    const categoryTotals = {};

    expenses.forEach((expense) => {
      const category =
        expense.category || "Other";

      const normalizedCategory =
        category.trim();

      if (!categoryTotals[normalizedCategory]) {
        categoryTotals[normalizedCategory] = 0;
      }

      categoryTotals[normalizedCategory] +=
        Number(expense.amount);
    });

    // --------------------------------------------------
    // 4. PREPARE EXPENSE DATA FOR AI
    // --------------------------------------------------

    const expenseContext = expenses
      .map((expense) => {
        const date = expense.createdAt
          ? new Date(
              expense.createdAt
            ).toLocaleDateString()
          : "Unknown date";

        return `
Date: ${date}
Amount: ₹${expense.amount}
Category: ${expense.category}
Merchant: ${expense.merchant || "N/A"}
Description: ${
          expense.description || "N/A"
        }
Payment Method: ${
          expense.paymentMethod || "N/A"
        }
`;
      })
      .join("\n");

    const categoryContext = Object.entries(
      categoryTotals
    )
      .map(
        ([category, amount]) =>
          `${category}: ₹${amount}`
      )
      .join("\n");

    // --------------------------------------------------
    // 5. AI PROMPT
    // --------------------------------------------------

    const systemPrompt = `
You are an intelligent AI Expense Assistant.

You help users understand and manage their expenses.

You can answer:
- Expense-related questions
- Spending analysis questions
- Budget questions
- Comparison questions
- Saving suggestions
- Financial planning questions based on the available expense data
- General questions in a helpful conversational way

IMPORTANT:
Use the user's expense data when answering questions about their personal spending.

Do NOT invent expenses or financial information.

If the user asks something unrelated to expenses, you can still answer naturally and helpfully.

You also support adding expenses.

If the user's message clearly means that they want to ADD an expense,
return ONLY this JSON format:

{
  "action": "ADD_EXPENSE",
  "amount": 500,
  "category": "Food",
  "merchant": "",
  "description": "",
  "paymentMethod": "Cash"
}

If the user is NOT asking to add an expense,
return ONLY this JSON format:

{
  "action": "CHAT",
  "reply": "Your natural language answer here"
}

Examples:

User:
I spent 500 on food

Response:
{
  "action": "ADD_EXPENSE",
  "amount": 500,
  "category": "Food",
  "merchant": "",
  "description": "",
  "paymentMethod": "Cash"
}

User:
What is my highest expense?

Response:
{
  "action": "CHAT",
  "reply": "Your highest expense is ..."
}

User:
How can I reduce my spending?

Response:
{
  "action": "CHAT",
  "reply": "Based on your spending..."
}

Always return valid JSON.
`;

    // --------------------------------------------------
    // 6. CREATE USER CONTEXT
    // --------------------------------------------------

    const userContext = `
USER EXPENSE INFORMATION

Total Expenses:
₹${totalExpenses}

Budget:
₹${budget || 0}

Remaining Budget:
₹${remainingBudget}

CATEGORY TOTALS:
${categoryContext || "No expenses available."}

INDIVIDUAL EXPENSES:
${
  expenseContext ||
  "No expenses have been recorded yet."
}
`;

    // --------------------------------------------------
    // 7. SEND QUESTION + CONTEXT TO GROQ / LLAMA
    // --------------------------------------------------

    const completion =
      await groq.chat.completions.create({
        model: "openai/gpt-oss-20b",

        messages: [
          {
            role: "system",
            content: systemPrompt,
          },
          {
            role: "user",
            content: `
${userContext}

USER QUESTION:
${message}
`,
          },
        ],
      });

    // --------------------------------------------------
    // 8. GET AI RESPONSE
    // --------------------------------------------------

    let reply =
      completion.choices[0].message.content;

    console.log(
      "AI Response:",
      reply
    );

    // Remove markdown code fences if AI adds them
    reply = reply
      .replace(/```json/gi, "")
      .replace(/```/g, "")
      .trim();

    // --------------------------------------------------
    // 9. PARSE AI RESPONSE
    // --------------------------------------------------

    let aiResponse;

    try {
      aiResponse = JSON.parse(reply);
    } catch (parseError) {
      console.log(
        "AI JSON Parse Error:",
        parseError
      );

      // Fallback if AI returns normal text
      return res.json({
        reply: reply,
      });
    }

    // --------------------------------------------------
    // 10. ADD EXPENSE THROUGH AI
    // --------------------------------------------------

    if (
      aiResponse.action ===
      "ADD_EXPENSE"
    ) {
      if (
        !aiResponse.amount ||
        !aiResponse.category
      ) {
        return res.json({
          reply:
            "I couldn't understand the expense details. Please mention the amount and category.",
        });
      }

      const expense =
        await Expense.create({
          userId,

          amount: Number(
            aiResponse.amount
          ),

          category:
            aiResponse.category,

          merchant:
            aiResponse.merchant || "",

          description:
            aiResponse.description ||
            "Added via AI",

          paymentMethod:
            aiResponse.paymentMethod ||
            "Cash",
        });

      return res.json({
        reply:
          `Added ₹${expense.amount} expense in ` +
          `${expense.category} category.`,
      });
    }

    // --------------------------------------------------
    // 11. NORMAL AI CHAT RESPONSE
    // --------------------------------------------------

    if (
      aiResponse.action === "CHAT"
    ) {
      return res.json({
        reply:
          aiResponse.reply ||
          "I'm sorry, I couldn't generate a response.",
      });
    }

    // --------------------------------------------------
    // 12. FALLBACK
    // --------------------------------------------------

    return res.json({
      reply:
        aiResponse.reply ||
        "I'm sorry, I couldn't understand that.",
    });

  } catch (error) {
    console.log(
      "AI Controller Error:",
      error
    );

    return res.status(500).json({
      message: "AI Error",
    });
  }
};

module.exports = {
  chatWithAI,
};