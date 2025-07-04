import React, { useState } from "react";

function ChatBot() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const sessionId = "user-session-id-001";
  const webhookURL = "https://expandingtogether.app.n8n.cloud/webhook-test/Workflow AI Index";

  const sendMessage = async () => {
    if (!input.trim()) return;
    const userMessage = { sender: "user", text: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch(webhookURL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sessionId,
          chatInput: input,
        }),
      });
      const data = await res.json();
      const aiReply = {
        sender: "bot",
        text: data.output || "(No response)"
      };
      setMessages((prev) => [...prev, aiReply]);
    } catch (err) {
      setMessages((prev) => [...prev, { sender: "bot", text: "Error contacting assistant." }]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <div className="w-full max-w-lg mx-auto p-4 min-h-screen flex flex-col">
      <h2 className="text-xl font-bold mb-4">🤖 Workflow Assistant</h2>
      <div className="flex-1 overflow-y-auto space-y-2 mb-4">
        {messages.map((msg, i) => (
          <div key={i} className={`p-2 rounded max-w-[75%] ${msg.sender === "user" ? "bg-blue-100 self-end" : "bg-gray-200 self-start"}`}>
            {msg.text}
          </div>
        ))}
        {loading && <div className="text-gray-500 italic">AI is thinking...</div>}
      </div>
      <textarea
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="Ask me about your workflows..."
        rows={2}
        className="w-full p-2 border rounded shadow"
      />
      <button onClick={sendMessage} className="mt-2 bg-black text-white px-4 py-2 rounded">
        Send
      </button>
    </div>
  );
}

export default ChatBot;