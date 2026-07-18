"use client";

import { useState, useRef, useEffect } from "react";
import { MessageCircle, X, Send, Bot, User, Loader2, Sparkles } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useSession } from "@/app/lib/auth-client";

type Message = {
  role: "system" | "user" | "assistant";
  content: string;
};

const SYSTEM_PROMPT = `You are Nova, the AI Chat Assistant for NovaCart. 
NovaCart is a premium clothing and fashion e-commerce platform. 
Your goal is to help users navigate the app, find clothing, understand their orders, and answer any general questions they have.
Be concise, helpful, and friendly. Use short paragraphs.`;

const SUGGESTED_PROMPTS = [
  "What is NovaCart?",
  "How do I track my order?",
  "Recommend some summer clothes",
];

export function ChatWidget() {
  const { data: session } = useSession();
  const [isOpen, setIsOpen] = useState(false);
  const [productsContext, setProductsContext] = useState("");
  const [messages, setMessages] = useState<Message[]>([
    { role: "system", content: SYSTEM_PROMPT },
    { role: "assistant", content: "Hi there! I'm Nova, your NovaCart assistant. How can I help you today?" }
  ]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Reset chat when the logged-in user changes (logout/login)
  useEffect(() => {
    setMessages([
      { role: "system", content: SYSTEM_PROMPT },
      { role: "assistant", content: "Hi there! I'm Nova, your NovaCart assistant. How can I help you today?" }
    ]);
    setIsOpen(false);
  }, [session?.user?.id]);

  // Fetch products from DB on mount
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL;
        const res = await fetch(`${apiUrl}/products`);
        if (res.ok) {
          const data = await res.json();
          // Create a compact list of products for the AI
          const compactCatalog = data.map((p: any) => 
            `- ${p.title || p.name} (${p.category}) - $${p.price}`
          ).join('\n');
          
          setProductsContext(`\n\nHere is the current NovaCart product catalog from the database:\n${compactCatalog}`);
        }
      } catch (e) {
        console.error("Failed to load products for AI context", e);
      }
    };
    fetchProducts();
  }, []);

  const handleSend = async (text: string) => {
    if (!text.trim()) return;

    const userMessage: Message = { role: "user", content: text };
    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    setInput("");
    setIsTyping(true);

    try {
      const apiKey = process.env.NEXT_PUBLIC_GROQ_CHAT_API_KEY;
      
      // Inject products context into the system message dynamically
      const apiMessages = newMessages.map(m => {
        if (m.role === "system") {
          return { role: m.role, content: m.content + productsContext };
        }
        return { role: m.role, content: m.content };
      });
      
      const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          model: "llama-3.1-8b-instant",
          messages: apiMessages,
          temperature: 0.7,
          stream: true, // Enable streaming
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to fetch response");
      }

      if (!response.body) throw new Error("No response body");

      const reader = response.body.getReader();
      const decoder = new TextDecoder("utf-8");
      let done = false;

      // Add a placeholder for the assistant's streaming response
      setMessages((prev) => [...prev, { role: "assistant", content: "" }]);
      setIsTyping(false);

      let buffer = "";

      while (!done) {
        const { value, done: readerDone } = await reader.read();
        done = readerDone;
        if (value) {
          buffer += decoder.decode(value, { stream: true });
          const lines = buffer.split('\n');
          // Keep the last, potentially incomplete line in the buffer
          buffer = lines.pop() || "";
          
          for (const line of lines) {
            const trimmedLine = line.trim();
            if (trimmedLine.startsWith('data: ') && trimmedLine !== 'data: [DONE]') {
              try {
                const data = JSON.parse(trimmedLine.slice(6));
                const content = data.choices[0]?.delta?.content || "";
                if (content) {
                  setMessages((prev) => {
                    const lastIdx = prev.length - 1;
                    const updated = [...prev];
                    updated[lastIdx] = {
                      ...updated[lastIdx],
                      content: updated[lastIdx].content + content
                    };
                    return updated;
                  });
                }
              } catch (e) {
                console.warn("Failed to parse stream chunk:", trimmedLine);
              }
            }
          }
        }
      }
    } catch (error) {
      console.error("Chat error:", error);
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: "Sorry, I'm having trouble connecting right now. Please try again later." }
      ]);
      setIsTyping(false);
    }
  };

  const visibleMessages = messages.filter(m => m.role !== "system");

  return (
    <>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="fixed bottom-24 right-6 w-[380px] max-w-[calc(100vw-48px)] h-[600px] max-h-[calc(100vh-120px)] bg-white dark:bg-[#1a1a1a] rounded-2xl shadow-2xl border border-neutral-200 dark:border-neutral-800 flex flex-col z-50 overflow-hidden"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-5 py-4 bg-[#1a1a1a] dark:bg-[#111] text-white">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center">
                  <Sparkles className="w-4 h-4 text-white" />
                </div>
                <div>
                  <h3 className="text-[14px] font-bold tracking-tight">Nova Assistant</h3>
                  <p className="text-[11px] text-neutral-400">Powered by Groq</p>
                </div>
              </div>
              <button 
                onClick={() => setIsOpen(false)}
                className="p-2 hover:bg-white/10 rounded-full transition-colors"
              >
                <X className="w-5 h-5 text-neutral-400 hover:text-white" />
              </button>
            </div>

            {/* Chat Area */}
            <div className="flex-1 overflow-y-auto p-5 bg-neutral-50 dark:bg-[#1a1a1a] flex flex-col gap-4">
              {visibleMessages.map((msg, idx) => (
                <div 
                  key={idx} 
                  className={`flex items-end gap-2 max-w-[85%] ${msg.role === "user" ? "self-end flex-row-reverse" : "self-start"}`}
                >
                  <div className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 ${
                    msg.role === "user" ? "bg-[#1a1a1a] dark:bg-white text-white dark:text-[#1a1a1a]" : "bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400"
                  }`}>
                    {msg.role === "user" ? <User className="w-3.5 h-3.5" /> : <Bot className="w-4 h-4" />}
                  </div>
                  <div className={`px-4 py-2.5 rounded-2xl text-[14px] leading-relaxed ${
                    msg.role === "user" 
                      ? "bg-[#1a1a1a] dark:bg-white text-white dark:text-[#1a1a1a] rounded-br-sm" 
                      : "bg-white dark:bg-[#222] border border-neutral-200 dark:border-neutral-800 text-[#1a1a1a] dark:text-neutral-200 rounded-bl-sm shadow-sm"
                  }`}>
                    {msg.content}
                  </div>
                </div>
              ))}
              
              {isTyping && (
                <div className="flex items-end gap-2 self-start max-w-[85%]">
                  <div className="w-7 h-7 rounded-full bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center shrink-0">
                    <Bot className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                  </div>
                  <div className="px-4 py-3 rounded-2xl rounded-bl-sm bg-white dark:bg-[#222] border border-neutral-200 dark:border-neutral-800 shadow-sm flex gap-1">
                    <motion.div className="w-1.5 h-1.5 bg-neutral-400 rounded-full" animate={{ y: [0, -3, 0] }} transition={{ repeat: Infinity, duration: 0.6, delay: 0 }} />
                    <motion.div className="w-1.5 h-1.5 bg-neutral-400 rounded-full" animate={{ y: [0, -3, 0] }} transition={{ repeat: Infinity, duration: 0.6, delay: 0.2 }} />
                    <motion.div className="w-1.5 h-1.5 bg-neutral-400 rounded-full" animate={{ y: [0, -3, 0] }} transition={{ repeat: Infinity, duration: 0.6, delay: 0.4 }} />
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Suggested Prompts */}
            {visibleMessages.length === 1 && !isTyping && (
              <div className="px-5 py-3 bg-neutral-50 dark:bg-[#1a1a1a] flex flex-wrap gap-2">
                {SUGGESTED_PROMPTS.map((prompt, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleSend(prompt)}
                    className="text-[11px] font-medium px-3 py-1.5 rounded-full border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-[#222] text-neutral-600 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
                  >
                    {prompt}
                  </button>
                ))}
              </div>
            )}

            {/* Input Area */}
            <div className="p-4 bg-white dark:bg-[#222] border-t border-neutral-200 dark:border-neutral-800">
              <form 
                onSubmit={(e) => { e.preventDefault(); handleSend(input); }}
                className="flex items-center gap-2 relative"
              >
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Ask Nova anything..."
                  className="w-full bg-neutral-100 dark:bg-[#111] border border-transparent focus:border-neutral-300 dark:focus:border-neutral-600 rounded-full pl-5 pr-12 py-3 text-[14px] text-[#1a1a1a] dark:text-white placeholder:text-neutral-400 outline-none transition-colors"
                />
                <button
                  type="submit"
                  disabled={!input.trim() || isTyping}
                  className="absolute right-2 p-1.5 bg-[#1a1a1a] dark:bg-white text-white dark:text-[#1a1a1a] rounded-full hover:scale-105 disabled:opacity-50 disabled:hover:scale-100 transition-all"
                >
                  {isTyping ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4 ml-0.5" />}
                </button>
              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating Toggle Button */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 w-14 h-14 bg-[#1a1a1a] dark:bg-white text-white dark:text-[#1a1a1a] rounded-full shadow-xl flex items-center justify-center z-50 hover:shadow-2xl transition-shadow"
      >
        {isOpen ? <X className="w-6 h-6" /> : <MessageCircle className="w-6 h-6" />}
      </motion.button>
    </>
  );
}
