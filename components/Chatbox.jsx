import { useState, useEffect, useRef } from "react";
import { GiStarsStack } from "react-icons/gi";
import { IoMdSend } from "react-icons/io";
import { PulseLoader } from "react-spinners";
import { useTheme } from "next-themes";
export default function ChatBox() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { role: "system", content: "Hello😁!   Captain-Awesome junior at your service" },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false); // 🔹 loading state
 const [color, setColor] = useState("");
  const chatRef = useRef(null);

  const toggleChat = () => setIsOpen((prev) => !prev);

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMsg = { role: "user", content: input };
    const updatedMessages = [...messages, userMsg];
    setMessages(updatedMessages);
    setInput("");

    // show loading text
    setLoading(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: updatedMessages }),
      });

      const data = await res.json();

      if (data.reply) {
        if (Array.isArray(data.reply)) {
          setMessages((prev) => [...prev, ...data.reply]);
        } else {
          setMessages((prev) => [...prev, data.reply]);
        }
      }
    } catch (err) {
      console.error("Error:", err);
      setMessages((prev) => [
        ...prev,
        { role: "system", content: "Something went wrong." },
      ]);
    } finally {
      setLoading(false); // 🔹 hide loading text when done
    }
  };

  // Close when clicking outside
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


  const { theme } = useTheme();
  useEffect(() => {
    setColor(theme === "dark" ? "white" : "black");
  }, [theme]);

  return (
    <div>
      {/* Floating button */}
      <button
        onClick={toggleChat}
        style={{ position: "fixed", bottom: 50, right: 15 }}
      >
      <GiStarsStack
  size={50}
  className="
    text-black 
    dark:text-[#ADD8E6] 
    drop-shadow-[0_0_12px_rgba(0,0,0,0.6)] 
    dark:drop-shadow-[0_0_15px_#ADD8E6]
  "
/>

      </button>

      {/* Chat UI */}
      {isOpen && (
        <div
     className=' dark:bg-[url("/back1.jpg")] bg-[url("/bg.jpg")] drop-shadow-[0_0_12px_rgba(0,0,0,0.6)] 
    dark:drop-shadow-[0_0_15px_#ADD8E6] '
          ref={chatRef}
          style={{
            position: "fixed",
            bottom: 70,
            right: 20,
            width: 320,
            height: 400,
            border: "2px solid #ccc",
            borderRadius: "8px",
          
            display: "flex",
            flexDirection: "column",
          }}
        >
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
                  {Array.isArray(msg.content)
                    ? msg.content.map((c, i) => <span key={i}>{c.text} </span>)
                    : msg.content}
                </p>
              </div>
            ))}

            {/* 🔹 Loading text */}
            {loading && (
             <PulseLoader color='white'  size={50}/>
            )}
          </div>

         
          <div style={{ display: "flex", padding: "6px" }}>
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              style={{
                flex: 1,
                padding: "8px",
                borderRadius: "4px",
                border: "none",
                outline: "none",
              }}
              placeholder="Ask something..."
            />
            <button
              onClick={sendMessage}
              disabled={loading} // 🔹 disable while loading
              style={{
                marginLeft: "6px",
                background: "transparent",
                border: "none",
                opacity: loading ? 0.5 : 1,
              }}
            >
              <IoMdSend size={30}  color="white" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
