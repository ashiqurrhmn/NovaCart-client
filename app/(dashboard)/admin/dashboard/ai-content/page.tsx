"use client";

import { useState, useEffect } from "react";
import { Sparkles, RefreshCw, Copy, Check, Loader2, Trash2 } from "lucide-react";
import toast from "react-hot-toast";
import { authClient, useSession } from "@/app/lib/auth-client";

const promptTemplates = [
  {
    id: "blog",
    label: "Blog / Article",
    placeholder: "Enter the topic or title for your blog post...",
    systemPrompt: "You are a professional blog writer. Write a well-structured, engaging, and informative blog article on the given topic. Use headings, subheadings, and paragraphs. Make it SEO-friendly.",
  },
  {
    id: "product",
    label: "Product Description",
    placeholder: "Enter the product name and key features...",
    systemPrompt: "You are an e-commerce copywriter. Write a compelling, persuasive product description that highlights benefits, features, and creates urgency. Use bullet points for key features.",
  },
  {
    id: "docs",
    label: "Documentation",
    placeholder: "Enter the topic or feature to document...",
    systemPrompt: "You are a technical writer. Write clear, concise, and well-organized documentation for the given topic. Include code examples where relevant, use proper formatting with headings and sections.",
  },
  {
    id: "social",
    label: "Social Media Post",
    placeholder: "Enter the topic or product to promote...",
    systemPrompt: "You are a social media content creator. Write engaging, attention-grabbing social media posts for the given topic. Include relevant hashtags, emojis, and a call to action. Create variants for different platforms (Twitter, Instagram, LinkedIn).",
  },
];

const outputLengths = [
  { value: "short", label: "Short", maxTokens: 256 },
  { value: "medium", label: "Medium", maxTokens: 1024 },
  { value: "long", label: "Long", maxTokens: 2048 },
];

export default function AIContentPage() {
  const [selectedTemplate, setSelectedTemplate] = useState(promptTemplates[0]);
  const [userInput, setUserInput] = useState("");
  const [outputLength, setOutputLength] = useState(outputLengths[1]);
  const [generatedContent, setGeneratedContent] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [copied, setCopied] = useState(false);
  const [history, setHistory] = useState<{prompt: string, content: string, date: Date, _id?: string}[]>([]);
  const { data: session } = useSession();
  const userEmail = session?.user?.email;

  useEffect(() => {
    if (userEmail) {
      const fetchHistory = async () => {
        try {
          const { data: tokenData } = await authClient.token();
          const jwtToken = tokenData?.token;
          const apiUrl = process.env.NEXT_PUBLIC_API_URL;
          const res = await fetch(`${apiUrl}/ai-history/${encodeURIComponent(userEmail)}`, {
            headers: {
              "Authorization": `Bearer ${jwtToken}`
            }
          });
          if (res.ok) {
            const data = await res.json();
            const parsedData = data.map((item: any) => ({
              ...item,
              date: new Date(item.date)
            }));
            setHistory(parsedData);
          }
        } catch (error) {
          console.error("Failed to fetch AI history:", error);
        }
      };
      fetchHistory();
    }
  }, [userEmail]);

  const generateContent = async () => {
    if (!userInput.trim()) {
      toast.error("Please enter a topic or prompt");
      return;
    }

    setIsGenerating(true);
    setGeneratedContent("");

    try {
      const apiKey = process.env.NEXT_PUBLIC_GROQ_API_KEY;
      
      const response = await fetch(
        `https://api.groq.com/openai/v1/chat/completions`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${apiKey}`,
          },
          body: JSON.stringify({
            model: "llama-3.1-8b-instant",
            messages: [
              { role: "system", content: selectedTemplate.systemPrompt },
              { role: "user", content: `${userInput}\n\nPlease generate content that is approximately ${outputLength.label.toLowerCase()} in length.` },
            ],
            max_tokens: outputLength.maxTokens,
            temperature: 0.8,
          }),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData?.error?.message || "API request failed");
      }

      const data = await response.json();
      const text = data?.choices?.[0]?.message?.content || "No content generated.";
      setGeneratedContent(text);
      
      const newHistoryItem = { prompt: userInput, content: text, date: new Date(), email: userEmail };
      setHistory(prev => [newHistoryItem, ...prev]);
      toast.success("Content generated successfully!");

      // Save to database
      if (userEmail) {
        try {
          const { data: tokenData } = await authClient.token();
          const jwtToken = tokenData?.token;
          const apiUrl = process.env.NEXT_PUBLIC_API_URL;
          await fetch(`${apiUrl}/ai-history`, {
            method: "POST",
            headers: { 
              "Content-Type": "application/json",
              "Authorization": `Bearer ${jwtToken}`
            },
            body: JSON.stringify(newHistoryItem),
          });
        } catch (dbError) {
          console.error("Failed to save history to DB:", dbError);
        }
      }

    } catch (error: any) {
      console.error("Groq API error:", error);
      toast.error(error.message || "Failed to generate content");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(generatedContent);
      setCopied(true);
      toast.success("Copied to clipboard!");
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error("Failed to copy");
    }
  };

  return (
    <div className="flex flex-col gap-6 pt-4 w-full">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-[#1a1a1a] dark:text-white tracking-tight transition-colors">
            AI Content Generator
          </h1>
          <p className="text-sm text-neutral-500 dark:text-neutral-400 mt-1 transition-colors">
            Generate high-quality content with Groq AI
          </p>
        </div>
        <div className="flex items-center gap-2 bg-white dark:bg-[#1a1a1a] px-4 py-2.5 rounded-xl border border-neutral-100 dark:border-neutral-800 shadow-sm shrink-0 transition-colors">
          <Sparkles className="w-4 h-4 text-neutral-900 dark:text-white" />
          <span className="text-sm font-semibold text-[#1a1a1a] dark:text-white transition-colors">
            Powered by Groq
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left Panel - Input */}
        <div className="flex flex-col gap-5">
          {/* Template Selection */}
          <div className="bg-white dark:bg-[#1a1a1a] rounded-2xl p-5 border border-neutral-100 dark:border-neutral-800 shadow-sm transition-colors">
            <label className="text-[11px] font-bold tracking-[0.1em] uppercase text-neutral-500 dark:text-neutral-400 mb-3 block">
              Content Type
            </label>
            <div className="grid grid-cols-2 gap-2">
              {promptTemplates.map((template) => (
                <button
                  key={template.id}
                  onClick={() => setSelectedTemplate(template)}
                  className={`px-4 py-2.5 rounded-xl text-[13px] font-medium border transition-all ${
                    selectedTemplate.id === template.id
                      ? "bg-[#1a1a1a] dark:bg-white text-white dark:text-[#1a1a1a] border-transparent shadow-sm"
                      : "bg-transparent text-neutral-600 dark:text-neutral-300 border-neutral-200 dark:border-neutral-700 hover:border-neutral-400 dark:hover:border-neutral-500"
                  }`}
                >
                  {template.label}
                </button>
              ))}
            </div>
          </div>

          {/* User Input */}
          <div className="bg-white dark:bg-[#1a1a1a] rounded-2xl p-5 border border-neutral-100 dark:border-neutral-800 shadow-sm transition-colors">
            <label className="text-[11px] font-bold tracking-[0.1em] uppercase text-neutral-500 dark:text-neutral-400 mb-3 block">
              Your Prompt
            </label>
            <textarea
              value={userInput}
              onChange={(e) => setUserInput(e.target.value)}
              placeholder={selectedTemplate.placeholder}
              rows={5}
              className="w-full bg-neutral-50 dark:bg-[#111] border border-neutral-200 dark:border-neutral-700 rounded-xl px-4 py-3 text-[14px] text-[#1a1a1a] dark:text-white placeholder:text-neutral-400 outline-none focus:border-neutral-400 dark:focus:border-neutral-500 transition-colors resize-none"
            />
          </div>

          {/* Output Length */}
          <div className="bg-white dark:bg-[#1a1a1a] rounded-2xl p-5 border border-neutral-100 dark:border-neutral-800 shadow-sm transition-colors">
            <label className="text-[11px] font-bold tracking-[0.1em] uppercase text-neutral-500 dark:text-neutral-400 mb-3 block">
              Output Length
            </label>
            <div className="flex gap-2">
              {outputLengths.map((length) => (
                <button
                  key={length.value}
                  onClick={() => setOutputLength(length)}
                  className={`flex-1 px-4 py-2.5 rounded-xl text-[13px] font-medium border transition-all ${
                    outputLength.value === length.value
                      ? "bg-[#1a1a1a] dark:bg-white text-white dark:text-[#1a1a1a] border-transparent shadow-sm"
                      : "bg-transparent text-neutral-600 dark:text-neutral-300 border-neutral-200 dark:border-neutral-700 hover:border-neutral-400 dark:hover:border-neutral-500"
                  }`}
                >
                  {length.label}
                </button>
              ))}
            </div>
          </div>

          {/* Generate Button */}
          <button
            onClick={generateContent}
            disabled={isGenerating || !userInput.trim()}
            className="w-full flex items-center justify-center gap-2 h-12 bg-[#1a1a1a] dark:bg-white text-white dark:text-[#1a1a1a] text-[13px] font-bold tracking-wider uppercase rounded-xl hover:bg-[#333] dark:hover:bg-neutral-200 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-sm"
          >
            {isGenerating ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Generating...
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                Generate Content
              </>
            )}
          </button>
        </div>

        {/* Right Panel - Output */}
        <div className="relative h-[500px] lg:h-full lg:min-h-full">
          <div className="lg:absolute lg:inset-0 bg-white dark:bg-[#1a1a1a] rounded-2xl border border-neutral-100 dark:border-neutral-800 shadow-sm transition-colors flex flex-col h-full">
          {/* Output Header */}
          <div className="flex items-center justify-between px-5 py-4 border-b border-neutral-100 dark:border-neutral-800">
            <span className="text-[11px] font-bold tracking-[0.1em] uppercase text-neutral-500 dark:text-neutral-400">
              Generated Content
            </span>
            {generatedContent && (
              <div className="flex items-center gap-2">
                <button
                  onClick={handleCopy}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[11px] font-medium text-neutral-500 hover:text-[#1a1a1a] dark:hover:text-white hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
                >
                  {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                  {copied ? "Copied" : "Copy"}
                </button>
                <button
                  onClick={generateContent}
                  disabled={isGenerating}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[11px] font-medium text-neutral-500 hover:text-[#1a1a1a] dark:hover:text-white hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors disabled:opacity-50"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${isGenerating ? 'animate-spin' : ''}`} />
                  Regenerate
                </button>
              </div>
            )}
          </div>

          {/* Output Content */}
          <div className="flex-1 p-5 overflow-y-auto">
            {isGenerating ? (
              <div className="flex flex-col items-center justify-center h-full gap-4">
                <Loader2 className="w-8 h-8 animate-spin text-neutral-400" />
                <p className="text-sm text-neutral-500">Generating content...</p>
              </div>
            ) : generatedContent ? (
              <div className="prose prose-sm dark:prose-invert max-w-none">
                <div className="whitespace-pre-wrap text-[14px] leading-relaxed text-[#1a1a1a] dark:text-neutral-200">
                  {generatedContent}
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-full gap-4 text-center">
                <div className="w-16 h-16 rounded-2xl bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center">
                  <Sparkles className="w-7 h-7 text-neutral-400" />
                </div>
                <div>
                  <p className="text-[14px] font-medium text-[#1a1a1a] dark:text-white mb-1">
                    No content generated yet
                  </p>
                  <p className="text-[12px] text-neutral-500 dark:text-neutral-400 max-w-[250px]">
                    Choose a content type, enter your prompt, and click Generate.
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
        </div>
      </div>

      {/* History Panel */}
      {history.length > 0 && (
        <div className="bg-white dark:bg-[#1a1a1a] rounded-2xl border border-neutral-100 dark:border-neutral-800 shadow-sm transition-colors p-5 mt-2">
          <h2 className="text-[11px] font-bold tracking-[0.1em] uppercase text-neutral-500 dark:text-neutral-400 mb-4 border-b border-neutral-100 dark:border-neutral-800 pb-2">
            Generation History
          </h2>
          <div className="flex flex-col gap-4">
            {history.map((item, idx) => (
              <div key={idx} className="flex flex-col gap-2 p-4 bg-neutral-50 dark:bg-[#111] rounded-xl border border-neutral-100 dark:border-neutral-800">
                <div className="flex items-start justify-between gap-4">
                  <p className="text-[12px] font-medium text-neutral-500 dark:text-neutral-400">
                    Prompt: <span className="text-[#1a1a1a] dark:text-white">"{item.prompt}"</span>
                  </p>
                  <p className="text-[10px] text-neutral-400 whitespace-nowrap">{item.date.toLocaleTimeString()}</p>
                </div>
                <div className="text-[13px] text-[#1a1a1a] dark:text-neutral-200 line-clamp-2 mt-1">
                  {item.content}
                </div>
                <button
                  onClick={() => {
                    setUserInput(item.prompt);
                    setGeneratedContent(item.content);
                  }}
                  className="self-start text-[11px] font-semibold text-neutral-900 dark:text-white hover:opacity-70 transition-opacity mt-1"
                >
                  Load in Editor
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
