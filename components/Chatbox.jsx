"use client";

import { useState, useEffect, useRef, useMemo } from "react";
import { IoMdSend } from "react-icons/io";
import { PulseLoader } from "react-spinners";
import { useTheme } from "next-themes";
import { BiSolidMessageRoundedDots } from "react-icons/bi";

export default function ChatBox({ content, title }) {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      role: "system",
      content:
        "Hello 😁! Captain-Awesome junior at your service, lets discuss the article titled: " +
        title,
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [color, setColor] = useState("");
  const chatRef = useRef(null);

  /* -------------------------------------------
     Extract plain text from rich article content
  -------------------------------------------- */
  const extractArticleText = (raw) => {
    if (!raw?.children) return "";

    return raw.children
      .map((block) =>
        block.children?.map((child) => child.text || "").join("")
      )
      .join("\n\n");
  };

  // Memoized so it doesn’t re-run on every render
  const articleText = useMemo(
    () => extractArticleText(content?.raw),
    [content]
  );

  const toggleChat = () => setIsOpen((prev) => !prev);

  /* -------------------------------------------
     Send message + article to API
  -------------------------------------------- */
  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMsg = { role: "user", content: input };
    const updatedMessages = [...messages, userMsg];

    setMessages(updatedMessages);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: updatedMessages,
          article: articleText, // 🔹 article grounding
        }),
      });

      const data = await res.json();

      if (data.reply) {
        setMessages((prev) =>
          Array.isArray(data.reply)
            ? [...prev, ...data.reply]
            : [...prev, data.reply]
        );
      }
    } catch (err) {
      console.error("Error:", err);
      setMessages((prev) => [
        ...prev,
        { role: "system", content: "Something went wrong." },
      ]);
    } finally {
      setLoading(false);
    }
  };

  /* -------------------------------------------
     Close chat when clicking outside
  -------------------------------------------- */
  useEffect(() => {
    function handleClickOutside(e) {
      if (chatRef.current && !chatRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    }

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  /* -------------------------------------------
     Theme handling
  -------------------------------------------- */
  const { theme } = useTheme();

  useEffect(() => {
    setColor(theme === "dark" ? "white" : "black");
  }, [theme]);

  /* -------------------------------------------
     Helper: Render message safely
  -------------------------------------------- */
  const renderMessageContent = (msg, index) => {
    // First system message with bold title
    if (index === 0 && msg.role === "system" && title) {
      return (
        <>
          Hello 😁! Captain-Awesome junior at your service, let's discuss the article titled:{" "}
          <strong>{title}</strong>
        </>
      );
    }

    // Plain string
    if (typeof msg.content === "string") return msg.content;

    // Array of objects (rich text)
    if (Array.isArray(msg.content)) {
      return msg.content
        .map((c) => (typeof c === "string" ? c : c.text || ""))
        .join(" ");
    }

    // Single object with text property
    if (msg.content && typeof msg.content === "object" && msg.content.text) {
      return msg.content.text;
    }

    return ""; // fallback
  };

  return (
    <div>
      {/* Floating button */}
      <button
        onClick={toggleChat}
        style={{ position: "fixed", bottom: 50 }}
        className="z-40 right-8 lg:right-[37%]"
      >
        <BiSolidMessageRoundedDots
          size={50}
          className="
            text-black 
            dark:text-[#ADD8E6] 
            drop-shadow-[0_0_12px_rgba(0,0,0,0.6)] 
            dark:drop-shadow-[0_0_15px_#ADD8E6]
          "
        />
      </button>

      {isOpen && (
        <div
          ref={chatRef}
          className='right-8 lg:right-[37%] dark:bg-[url("/back1.jpg")] bg-[url("/bg.jpg")] 
          drop-shadow-[0_0_12px_rgba(0,0,0,0.6)] 
          dark:drop-shadow-[0_0_15px_#ADD8E6] z-50'
          style={{
            position: "fixed",
            bottom: 70,
            width: 320,
            height: 400,
            border: "2px solid #ccc",
            borderRadius: "8px",
            display: "flex",
            flexDirection: "column",
          }}
        >
          {/* Messages */}
          <div style={{ flex: 1, overflowY: "auto", padding: 10 }}>
            {messages.map((msg, i) => (
              <div
                key={i}
                style={{
                  display: "flex",
                  justifyContent:
                    msg.role === "user" ? "flex-end" : "flex-start",
                  marginBottom: "6px",
                }}
              >
                <p
                  style={{
                    background: msg.role === "user" ? "blue" : "white",
                    color: msg.role === "user" ? "white" : "black",
                    borderRadius: "6px",
                    padding: "8px 10px",
                    maxWidth: "70%",
                    wordWrap: "break-word",
                  }}
                >
                  {renderMessageContent(msg, i)}
                </p>
              </div>
            ))}

            {loading && <PulseLoader color="white" size={10} />}
          </div>

          {/* Input */}
          <div style={{ display: "flex", padding: "6px" }}>
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask something..."
              style={{
                flex: 1,
                padding: "8px",
                borderRadius: "4px",
                border: "none",
                outline: "none",
              }}
            />
            <button
              onClick={sendMessage}
              disabled={loading}
              style={{
                marginLeft: "6px",
                background: "transparent",
                border: "none",
                opacity: loading ? 0.5 : 1,
              }}
            >
              <IoMdSend size={30} color="white" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
