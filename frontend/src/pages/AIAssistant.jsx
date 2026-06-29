import { useState } from "react";
import API from "../services/api";
import Layout from "../components/Layout";
function AIAssistant() {
  const [message, setMessage] = useState("");

  const [messages, setMessages] = useState([
    {
      sender: "AI",
      text: `👋 Welcome to AI Expense Assistant!

You can ask things like:

• How much did I spend on Food?
• Show my recent expenses
• What is my highest expense?
• Give me spending insights
• How much budget is left?`,
    },
  ]);

  const handleSend = async () => {
    if (!message) return;

    try {
      const userMessage = {
        sender: "You",
        text: message,
      };

      setMessages((prev) => [
        ...prev,
        userMessage,
      ]);

      const user = JSON.parse(
  localStorage.getItem("user")
);
const budget =
  localStorage.getItem("budget") || 0;

const res = await API.post("/ai/chat", {
  message,
  userId: user.id,
  budget,
});

      const aiMessage = {
        sender: "AI",
        text: res.data.reply,
      };

      setMessages((prev) => [
        ...prev,
        aiMessage,
      ]);

      setMessage("");
    } catch (error) {
      console.log(error);
      alert("Failed to connect AI");
    }
  };

  return (
    <Layout>
      <h1
  style={{
    color: "#1e293b",
    marginBottom: "25px",
  }}
>
  AI Expense Assistant
</h1>

    <div
  style={{
    background: "#fff",
    borderRadius: "15px",
    padding: "20px",
   height: "350px",
    overflowY: "auto",
    boxShadow:
      "0 4px 12px rgba(0,0,0,0.08)",
    marginBottom: "20px",
  }}
>
 {messages.map((msg, index) => (
  <div
    key={index}
    style={{
      display: "flex",
      justifyContent:
        msg.sender === "You"
          ? "flex-end"
          : "flex-start",
      marginBottom: "15px",
    }}
  >
    <div
      style={{
        background:
          msg.sender === "You"
           ? "#2563eb"
    : "#f1f5f9",
        color:
          msg.sender === "You"
            ? "white"
            : "black",
        padding: "12px",
        borderRadius: "12px",
        maxWidth: "60%",
        whiteSpace: "pre-line",
      }}
    >
      <strong>{msg.sender}</strong>
      <br />
      {msg.text}
    </div>
  </div>
))}
      </div>
<div
  style={{
    display: "flex",
    gap: "10px",
  }}
>
<input
  type="text"
  placeholder="Ask about expenses..."
  value={message}
  onChange={(e) =>
    setMessage(e.target.value)
  }
  onKeyDown={(e) => {
    if (e.key === "Enter") {
      handleSend();
    }
  }}
  style={{
    flex: 1,
    padding: "12px",
    borderRadius: "8px",
    border: "1px solid #ccc",
  }}
/>

  <button
    onClick={handleSend}
    style={{
      background: "#2563eb",
      color: "white",
      border: "none",
      padding: "12px 20px",
      borderRadius: "8px",
      cursor: "pointer",
    }}
  >
    Send
  </button>
</div>
    </Layout>
  );
}

export default AIAssistant;