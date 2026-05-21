import { useState, useRef, useEffect } from "react";
import axios from "axios";

import Titlebar from "../Components/titlebar/Titlebar";
import Chatsection from "../Components/chatsection/Chatsection";

const API_BASE_URL =
  import.meta.env.VITE_API_URL || "http://localhost:8000";

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

const Chat = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [role, setRole] = useState("employee");
  const [darkMode, setDarkMode] = useState(false);
  const [backendStatus, setBackendStatus] = useState("checking");
  const [isOpen, setIsOpen] = useState(false);

  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  // Backend health check
  useEffect(() => {
    const checkBackend = async () => {
      try {
        await api.get("/health");
        setBackendStatus("connected");
      } catch (error) {
        console.error(error);
        setBackendStatus("disconnected");
      }
    };

    checkBackend();
  }, []);

  // Dark mode
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [darkMode]);

  // Scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({
      behavior: "smooth",
    });
  }, [messages]);

  // Welcome message
  useEffect(() => {
    setMessages([
      {
        id: "welcome",
        type: "bot",
        content: `Welcome to Sheria AI 🇰🇪`,
        timestamp: new Date(),
      },
    ]);
  }, []);

  // Role switch message
  useEffect(() => {
    if (messages.length > 0) {
      const systemMessage = {
        id: Date.now(),
        type: "system",
        content: `Switched to ${
          role === "employee" ? "Employee" : "Employer"
        } Mode`,
        timestamp: new Date(),
      };

      setMessages((prev) => {
        const filtered = prev.filter((m) => m.type !== "system");
        return [...filtered, systemMessage];
      });
    }
  }, [role]);

  const sendMessage = async () => {
    if (!input.trim() || loading) return;

    const userMessage = {
      id: Date.now(),
      type: "user",
      content: input,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);

    const currentInput = input;

    setInput("");
    setLoading(true);

    try {
      const response = await api.post("/ask", {
        query: currentInput,
        role,
      });

      const botMessage = {
        id: Date.now() + 1,
        type: "bot",
        content: response.data.answer,
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, botMessage]);
    } catch (error) {
      console.error(error);

      const errorMessage = {
        id: Date.now() + 1,
        type: "bot",
        content: "Server connection failed.",
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setLoading(false);
      inputRef.current?.focus();
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const deleteChatById = (idToDelete) => {
    setMessages((prev) =>
      prev.filter((message) => message.id !== idToDelete)
    );
  };

  const suggestedQuestions =
    role === "employee"
      ? [
          "How much annual leave am I entitled to?",
          "Can I be fired without notice?",
          "What is maternity leave?",
        ]
      : [
          "How do I terminate an employee legally?",
          "What records should employers keep?",
          "What deductions are legal?",
        ];

  return (
    <div
      className={`
        h-screen
        flex
        flex-col
        overflow-hidden

        bg-gradient-to-br
        from-gray-50
        via-white
        to-gray-100

        dark:from-zinc-950
        dark:via-zinc-900
        dark:to-black

        transition-colors
        duration-300
      `}
    >
      {/* HEADER */}
      <div
        className="
          h-[60px]
          shrink-0
          border-b
          border-gray-200
          dark:border-zinc-800
          backdrop-blur-md
          bg-white/70
          dark:bg-zinc-900/70
        "
      >
        <Titlebar
          setDarkMode={setDarkMode}
          backendStatus={backendStatus}
          darkMode={darkMode}
          setRole={setRole}
          role={role}
        />
      </div>

      {/* CHAT AREA */}
      <div
        className="
          flex-1
          overflow-hidden
          relative
        "
      >
        <div
          className="
            h-full
            overflow-y-auto
            px-4
            py-6
            scrollbar-thin
            scrollbar-thumb-zinc-300
            dark:scrollbar-thumb-zinc-700
            scrollbar-track-transparent
          "
        >
          <Chatsection
            messages={messages}
            setRole={setRole}
            role={role}
            sendMessage={sendMessage}
            messagesEndRef={messagesEndRef}
            deleteChatById={deleteChatById}
            loading={loading}
            setInput={setInput}
            handleKeyPress={handleKeyPress}
            inputRef={inputRef}
            input={input}
            suggestedQuestions={suggestedQuestions}
            isOpen={isOpen}
            setIsOpen={setIsOpen}
          />
        </div>
      </div>

      {/* INPUT */}
      <div
        className="
          shrink-0
          border-t
          border-gray-200
          dark:border-zinc-800
          bg-white/80
          dark:bg-zinc-900/80
          backdrop-blur-md
          p-4
        "
      >
        <div
          className="
            max-w-4xl
            mx-auto
            flex
            items-end
            gap-3
          "
        >
          <textarea
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyPress}
            placeholder="Ask a question..."
            rows={1}
            className="
              flex-1
              resize-none
              rounded-2xl
              border
              border-gray-300
              dark:border-zinc-700
              bg-white
              dark:bg-zinc-800
              px-4
              py-3
              text-sm
              text-gray-900
              dark:text-white
              outline-none
              focus:ring-2
              focus:ring-green-500
              transition-all
            "
          />

          <button
            onClick={sendMessage}
            disabled={loading}
            className="
              rounded-2xl
              bg-green-600
              hover:bg-green-700
              disabled:opacity-50
              disabled:cursor-not-allowed
              px-5
              py-3
              text-white
              font-medium
              transition-all
              duration-200
              active:scale-95
            "
          >
            {loading ? (
              <div
                className="
                  w-5
                  h-5
                  border-2
                  border-white
                  border-t-transparent
                  rounded-full
                  animate-spin
                "
              />
            ) : (
              "Send"
            )}
          </button>
        </div>

        {/* Suggested Questions */}
        <div
          className="
            max-w-4xl
            mx-auto
            mt-4
            flex
            gap-2
            overflow-x-auto
            pb-1
          "
        >
          {suggestedQuestions.map((question, index) => (
            <button
              key={index}
              onClick={() => setInput(question)}
              className="
                whitespace-nowrap
                rounded-full
                border
                border-gray-300
                dark:border-zinc-700
                bg-white
                dark:bg-zinc-800
                px-4
                py-2
                text-xs
                text-gray-700
                dark:text-gray-300
                hover:bg-gray-100
                dark:hover:bg-zinc-700
                transition-all
                duration-200
              "
            >
              {question}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Chat;