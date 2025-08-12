import React, { useState, useEffect, useRef } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

export default function App() {
  const [messages, setMessages] = useState(() => {
    const saved = localStorage.getItem("chatHistory");
    return saved ? JSON.parse(saved) : [];
  });
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [theme, setTheme] = useState(() => localStorage.getItem("theme") || "light");
  const chatEndRef = useRef(null);
  const backend = import.meta.env.VITE_API_URL || "http://localhost:8000";

  useEffect(() => {
    localStorage.setItem("chatHistory", JSON.stringify(messages));
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    document.body.style.background = theme === "dark" ? "#212121" : "#f5f5f5";
    document.body.style.color = theme === "dark" ? "#fff" : "#000";
    localStorage.setItem("theme", theme);
  }, [theme]);

  const toggleTheme = () => setTheme((prev) => (prev === "light" ? "dark" : "light"));

  const clearChat = () => {
    setMessages([]);
    localStorage.removeItem("chatHistory");
  };

  const send = async () => {
    if (!input.trim()) return;

    const newUserMsg = { role: "user", content: input };
    setMessages((prev) => [...prev, newUserMsg]);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch(`${backend}/api/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: [...messages, newUserMsg] }),
      });
      const data = await res.json();
      if (data.answer) {
        setMessages((prev) => [...prev, { role: "assistant", content: data.answer }]);
      }
    } catch (err) {
      setMessages((prev) => [...prev, { role: "assistant", content: "Error: " + String(err) }]);
    }
    setLoading(false);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      send();
    }
  };

  // Silent copy
  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text).catch((err) => {
      console.error("Failed to copy text:", err);
    });
  };

  return (
    <div style={{ ...styles.container, background: theme === "dark" ? "#212121" : "#f5f5f5" }}>
      {/* Header */}
      <div style={{ ...styles.header, background: theme === "dark" ? "#212121" : "#f5f5f5" }}>
        <div style={{ fontSize: "40px", fontWeight: "bold" }}>Welcome, ChatGPT Clone</div>
        <div style={{ fontSize: "12px", opacity: 0.7 }}>Built by Dhyey Shah</div>
        <button style={styles.themeButton} onClick={toggleTheme}>
          {theme === "light" ? "🌙 Dark" : "☀️ Light"}
        </button>
      </div>

      {/* Chat Window */}
      <div style={styles.chatWindow}>
        {messages.map((m, i) => (
          <div
            key={i}
            style={
              m.role === "user"
                ? { ...styles.userMessage, background: theme === "dark" ? "#0b93f6" : "#dcf8c6" }
                : { ...styles.assistantMessage, background: theme === "dark" ? "#2f2f2f" : "#ffffff", color: theme === "dark" ? "#ffffff" : "#000000" }
            }
          >
            {m.role === "assistant" ? (
              <div style={styles.assistantContent}>
                <ReactMarkdown
                  remarkPlugins={[remarkGfm]}
                  components={{
                    h1: ({ children }) => (
                      <h1 style={{ fontWeight: "bold", marginBottom: "8px" }}>{children}</h1>
                    ),
                    h2: ({ children }) => (
                      <h2 style={{ fontWeight: "bold", marginBottom: "6px" }}>{children}</h2>
                    ),
                    h3: ({ children }) => (
                      <h3 style={{ fontWeight: "bold", marginBottom: "4px" }}>{children}</h3>
                    )
                  }}
                >
                  {m.content}
                </ReactMarkdown>
                <button onClick={() => copyToClipboard(m.content)} style={styles.copyButton} title="Copy reply">📋</button>
              </div>
            ) : (
              <div>{m.content}</div>
            )}
          </div>
        ))}

        {loading && (
          <div style={styles.typingIndicator}>
            <span></span><span></span><span></span>
          </div>
        )}
        <div ref={chatEndRef} />
      </div>

      {/* Input Bar */}
      <div style={{
        ...styles.inputWrapper,
        background: theme === "dark" ? "#2c2c2c" : "#fff",
        border: theme === "dark" ? "1px solid #444" : "1px solid #ccc",
      }}>
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Ask Anything!"
          style={{
            ...styles.textarea,
            background: theme === "dark" ? "#1e1e1e" : "#fff",
            color: theme === "dark" ? "#fff" : "#000",
          }}
        />
        <div style={styles.buttonGroup}>
          <button onClick={send} style={styles.sendIconButton}>➤</button>
          <button onClick={clearChat} style={styles.clearButton}>🗑</button>
        </div>
      </div>
    </div>
  );
}

const styles = {
  container: { display: "flex", flexDirection: "column", height: "100vh", fontFamily: "Arial, sans-serif", transition: "all 0.3s ease" },
  header: { position: "fixed", top: 0, left: 0, right: 0, padding: "16px", textAlign: "center", zIndex: 1000 },
  themeButton: { marginTop: "8px", padding: "5px 10px", background: "#444", color: "#fff", border: "none", borderRadius: "5px", cursor: "pointer" },
  chatWindow: { flex: 1, overflowY: "auto", padding: "20px", display: "flex", flexDirection: "column", gap: "20px", marginTop: "120px", marginBottom: "80px" },
  userMessage: { alignSelf: "flex-end", padding: "10px 15px", borderRadius: "12px", maxWidth: "75%", lineHeight: "1.4", whiteSpace: "pre-wrap" },
  assistantMessage: { alignSelf: "center", maxWidth: "750px", width: "100%", padding: "10px 15px", borderRadius: "10px", textAlign: "left", lineHeight: "1.6", position: "relative" },
  assistantContent: { fontSize: "16px" },
  inputWrapper: { position: "fixed", bottom: "10px", left: "50%", transform: "translateX(-50%)", display: "flex", alignItems: "center", borderRadius: "30px", padding: "5px 10px", maxWidth: "750px", width: "100%", zIndex: 1000 },
  textarea: { flex: 1, padding: "8px", borderRadius: "20px", resize: "none", fontSize: "14px", height: "38px", outline: "none", border: "none" },
  buttonGroup: { display: "flex", gap: "5px", marginLeft: "8px" },
  sendIconButton: { background: "#10a37f", color: "#fff", border: "none", borderRadius: "50%", width: "34px", height: "34px", cursor: "pointer", fontSize: "14px", display: "flex", justifyContent: "center", alignItems: "center" },
  clearButton: { background: "#b22222", color: "#fff", border: "none", borderRadius: "50%", width: "34px", height: "34px", cursor: "pointer", fontSize: "14px", display: "flex", justifyContent: "center", alignItems: "center" },
  typingIndicator: { display: "flex", gap: "4px", padding: "5px 10px", background: "#eee", borderRadius: "8px", width: "fit-content" },
  copyButton: { position: "absolute", right: "-35px", top: "5px", background: "transparent", border: "none", cursor: "pointer", fontSize: "16px" }
};
