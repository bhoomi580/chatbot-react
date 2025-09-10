import React, { useState, useEffect } from "react";
import Message from "./Message";

export default function ChatWindow() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");

  useEffect(() => {
    fetch("http://localhost:5000/history")
      .then(res => res.json())
      .then(data => setMessages(data))
      .catch(console.error);
  }, []);

  async function sendMessage(e) {
    e.preventDefault();
    if (!input.trim()) return;

    const userMsg = { from: "user", text: input };
    setMessages([...messages, userMsg]);
    setInput("");

    const res = await fetch("http://localhost:5000/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message: input })
    });

    const data = await res.json();
    const botMsg = { from: "bot", text: data.reply };
    setMessages(m => [...m, userMsg, botMsg]);
  }

  return (
    <div className="chat-window">
      <div className="messages">
        {messages.map((m, i) => (
          <Message key={i} from={m.from} text={m.text} />
        ))}
      </div>
      <form className="composer" onSubmit={sendMessage}>
        <input
          value={input}
          onChange={e => setInput(e.target.value)}
          placeholder="Type your message..."
        />
        <button type="submit">Send</button>
      </form>
    </div>
  );
}
