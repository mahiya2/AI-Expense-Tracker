import { useState } from "react";
import API from "../services/api";
import Layout from "../components/Layout";
import "../styles/AIAssistant.css";
function AIAssistant() {
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const [messages, setMessages] = useState([
    {
      sender: "AI",
      text: `👋 Welcome to AI Expense Assistant!

You can ask me anything about your expenses.

For example:

• How much did I spend on Food?
• What is my highest expense?
• Why am I spending so much?
• Compare my Food and Travel expenses.
• How can I reduce my spending?
• Give me a summary of my expenses.
• How much budget do I have left?

You can also say something like:
"I spent ₹500 on Food"
and I can add it to your expenses.`,
    },
  ]);

  const handleSend = async () => {
    const trimmedMessage = message.trim();

    if (!trimmedMessage || loading) return;

    try {
      // Add user message
      const userMessage = {
        sender: "You",
        text: trimmedMessage,
      };

      setMessages((prev) => [
        ...prev,
        userMessage,
      ]);

      // Clear input immediately
      setMessage("");

      // Show loading state
      setLoading(true);

     const budget =
  localStorage.getItem("budget") || 0;

const res = await API.post("/ai/chat", {
  message: trimmedMessage,
  budget,
});
      // Add AI response
      const aiMessage = {
        sender: "AI",
        text: res.data.reply,
      };

      setMessages((prev) => [
        ...prev,
        aiMessage,
      ]);

    } catch (error) {
      console.log(error);

      const errorMessage = {
        sender: "AI",
        text: "❌ Sorry, I couldn't connect to the AI. Please try again.",
      };

      setMessages((prev) => [
        ...prev,
        errorMessage,
      ]);

    } finally {
      setLoading(false);
    }
  };

  const clearChat = () => {
    setMessages([
      {
        sender: "AI",
        text: `👋 Chat cleared!

How can I help you with your expenses?`,
      },
    ]);
  };

  return (
    <Layout>
{/* Header */}
<div className="ai-header">

  <div className="ai-title-section">

    <span className="ai-label">
      ✨ AI Powered
    </span>

    <h1>
      🤖 AI Expense Assistant
    </h1>

    <p>
      Ask questions, understand your spending,
      and manage expenses with AI.
    </p>

  </div>

  <div className="ai-header-actions">

    <div className="ai-status">
      <span className="ai-status-dot"></span>
      AI Online
    </div>

    <button
      onClick={clearChat}
      disabled={loading}
      className="clear-chat-btn"
    >
      🧹 Clear Chat
    </button>

  </div>

</div>
  {/* Chat Box */}
<div className="ai-chat-box">

        {messages.map((msg, index) => (
       <div
  key={index}
  className={`ai-message-row ${
    msg.sender === "You"
      ? "user-message-row"
      : "ai-message-row-left"
  }`}
>
<div
  className={
    msg.sender === "You"
      ? "user-message"
      : "ai-message"
  }
>

            <div
  className={
    msg.sender === "You"
      ? "user-message-label"
      : "ai-message-label"
  }
>
  {msg.sender === "You"
    ? "👤 You"
    : "🤖 AI Assistant"}
</div>

              <div>
                {msg.text}
              </div>

            </div>

          </div>
        ))}

  {/* AI Thinking Indicator */}
{loading && (
  <div className="ai-message-row ai-message-row-left">

    <div className="ai-typing">

      <span>🤖 AI Assistant</span>

      <div className="typing-dots">
        <span></span>
        <span></span>
        <span></span>
      </div>

    </div>

  </div>
)}

      </div>

      {/* Input Area */}
<div className="ai-input-container">

      <input
  type="text"
  placeholder="Ask anything about your expenses..."
  value={message}
  onChange={(e) =>
    setMessage(e.target.value)
  }
  onKeyDown={(e) => {
    if (
      e.key === "Enter" &&
      !loading
    ) {
      handleSend();
    }
  }}
  disabled={loading}
  className="ai-message-input"
/>

      <button
  onClick={handleSend}
  disabled={
    loading ||
    !message.trim()
  }
  className="ai-send-button"
>
  {loading
    ? "Thinking..."
    : "➤ Send"}
</button>

      </div>

    </Layout>
  );
}

export default AIAssistant;