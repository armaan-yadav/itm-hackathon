import React, { useState, useEffect, useRef } from "react";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { MessageCircle, X } from "lucide-react";

const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-pro" });

const ChatWidget = () => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [currentTypingIndex, setCurrentTypingIndex] = useState(-1);
  const [displayText, setDisplayText] = useState("");
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, displayText]);

  useEffect(() => {
    if (isOpen) {
      loadMessages();
    }
  }, [isOpen]);

  useEffect(() => {
    if (currentTypingIndex >= 0 && currentTypingIndex < messages.length) {
      const message = messages[currentTypingIndex];
      if (message.sender === "bot" && message.text) {
        let index = 0;
        const text = formatResponse(message.text);

        const typeNextCharacter = () => {
          if (index < text.length) {
            setDisplayText(text.substring(0, index + 1));
            index++;

            const delay =
              text[index] === "\n"
                ? 400
                : text[index] === "."
                ? 300
                : text[index] === ","
                ? 200
                : 25;
            setTimeout(typeNextCharacter, delay);
          } else {
            setTimeout(() => {
              setCurrentTypingIndex(-1);
            }, 500);
          }
        };

        typeNextCharacter();
      }
    }
  }, [currentTypingIndex, messages]);

  const formatResponse = (text) => {
    // Format numbered lists (1., 2., etc.)
    text = text.replace(/(\d+\.\s)/g, "\n$1");

    // Format bullet points with consistent spacing
    text = text.replace(/[•\-*]\s/g, "\n• ");

    // Format alphabetical points (a., b., etc.) with consistent spacing
    text = text.replace(/([a-z]\.\s)/g, "\n$1");

    // Format roman numerals (i., ii., etc.) with consistent spacing
    text = text.replace(/((?:i|ii|iii|iv|v|vi|vii|viii|ix|x)\.\s)/g, "\n$1");

    // Add extra newline between sections for better readability
    text = text.replace(/\n(?=[IVX]\.|[1-9]\.|[a-z]\.)/g, "\n\n");

    // Ensure consistent spacing after punctuation
    text = text.replace(/([.,:!?])\s*/g, "$1 ");

    // Remove multiple consecutive newlines
    text = text.replace(/\n{3,}/g, "\n\n");

    return text.trim();
  };

  const loadMessages = async () => {
    try {
      const initialMessage = {
        id: 1,
        text: "Hello! I'm your AI assistant powered by Google Gemini. How can I help you today?",
        sender: "bot",
        timestamp: new Date().toISOString(),
      };
      setMessages([initialMessage]);
      setCurrentTypingIndex(0);
    } catch (error) {
      console.error("Error loading messages:", error);
      //   toast.error("Failed to load messages");
    }
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    try {
      setLoading(true);

      const userMessage = {
        id: messages.length + 1,
        text: newMessage,
        sender: "user",
        timestamp: new Date().toISOString(),
      };
      setMessages((prev) => [...prev, userMessage]);
      setNewMessage("");

      const result = await model.generateContent(
        [
          "You are an AI assistant for Kisan Sarthi, an agricultural platform. Format your response clearly using:",
          "1. Use appropriate formatting based on the content type:",
          "   • For sequential steps or processes: Use numbers (1., 2., 3.)",
          "   • For main topics or categories: Use roman numerals (I., II., III.)",
          "   • For examples or sub-points: Use letters (a., b., c.)",
          "   • For features or unordered items: Use bullet points (•)",
          "2. Structure your response with:",
          "   • A brief introduction or direct answer first",
          "   • Organized points with proper hierarchy",
          "   • Clear spacing between different sections",
          "3. Keep the agricultural context in mind and use farmer-friendly language",
          "4. Be concise but informative",
          "Question: " + newMessage,
        ].join("\n")
      );

      const response = await result.response;
      const responseText = response.text().replace(/\*/g, "").trim();

      const botMessage = {
        id: messages.length + 2,
        text: responseText,
        sender: "bot",
        timestamp: new Date().toISOString(),
      };

      setMessages((prev) => [...prev, botMessage]);
      setCurrentTypingIndex(messages.length + 1);
    } catch (error) {
      console.error("Error sending message:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed bottom-4 right-4 z-50">
      {!isOpen ? (
        <button
          onClick={() => setIsOpen(true)}
          className="w-14 h-14 bg-green-600 rounded-full flex items-center justify-center text-white shadow-lg hover:bg-green-700 transition-all duration-300 ease-in-out"
        >
          <MessageCircle size={24} />
        </button>
      ) : (
        <div className="bg-white rounded-lg shadow-lg w-[400px] transform transition-all duration-300 ease-in-out">
          <div className="p-4 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold text-green-600">
                Gemini AI Assistant
              </h2>
              <button
                onClick={() => setIsOpen(false)}
                className="text-gray-500 hover:text-gray-700 transition-colors"
              >
                <X size={20} />
              </button>
            </div>
          </div>

          <div className="h-[400px] overflow-y-auto p-4 space-y-4">
            {messages.map((message, index) => (
              <div
                key={message.id}
                className={`flex ${
                  message.sender === "user" ? "justify-end" : "justify-start"
                } animate-fadeIn`}
              >
                <div
                  className={`max-w-[70%] rounded-lg p-3 ${
                    message.sender === "user"
                      ? "bg-green-600 text-white"
                      : "bg-gray-100 text-gray-800"
                  } transition-all duration-300 ease-in-out`}
                >
                  <div className="text-sm whitespace-pre-wrap font-sans leading-relaxed">
                    {message.sender === "bot" && index === currentTypingIndex
                      ? displayText
                      : message.text}
                  </div>
                  <span className="text-xs opacity-75 mt-1 block">
                    {new Date(message.timestamp).toLocaleTimeString()}
                  </span>
                </div>
              </div>
            ))}
            {loading && (
              <div className="flex justify-start w-full my-4 animate-fadeIn">
                <div className="bg-gray-100 rounded-lg p-4 shadow-md">
                  <div className="flex items-center space-x-2">
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-green-500 rounded-full animate-typing"></div>
                      <div className="w-2 h-2 bg-green-500 rounded-full animate-typing-2"></div>
                      <div className="w-2 h-2 bg-green-500 rounded-full animate-typing-3"></div>
                    </div>
                    <span className="text-sm text-gray-500">
                      AI is thinking...
                    </span>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          <div className="p-4 border-t border-gray-200">
            <form onSubmit={handleSendMessage} className="flex gap-2">
              <input
                type="text"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder="Ask Gemini anything..."
                className="flex-1 rounded-lg border border-gray-300 p-2 focus:outline-none focus:ring-2 focus:ring-green-500"
                disabled={loading}
              />
              <button
                type="submit"
                disabled={loading || !newMessage.trim()}
                className="bg-green-600 text-white rounded-lg px-4 py-2 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 disabled:opacity-50"
              >
                Send
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChatWidget;
