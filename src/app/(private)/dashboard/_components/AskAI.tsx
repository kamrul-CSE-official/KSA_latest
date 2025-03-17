"use client";

import type React from "react";

import { useState, useRef, useEffect, memo } from "react";
import { motion } from "framer-motion";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Bot,
  Loader2,
  Clipboard,
  RefreshCcw,
  Send,
  User,
  Code,
  HelpCircle,
  FileText,
  Sparkles,
} from "lucide-react";
import { toast } from "sonner";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useSelector } from "react-redux";
import type { RootState } from "@/redux/store";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import axios from "axios";
import { getBaseUrl } from "@/config/envConfig";
import ReactMarkdown from "react-markdown";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

// Suggested prompts for empty state
const SUGGESTED_PROMPTS = [
  {
    icon: <HelpCircle className="h-4 w-4" />,
    text: "How can I use Naturub services?",
  },
  {
    icon: <Code className="h-4 w-4" />,
    text: "What features are available in the app?",
  },
  {
    icon: <FileText className="h-4 w-4" />,
    text: "Can you explain how to book an appointment?",
  },
];

// Typing animation component
const TypingAnimation = () => (
  <div className="flex space-x-1 items-center">
    <motion.div
      className="h-2 w-2 bg-primary rounded-full"
      animate={{ scale: [1, 1.2, 1] }}
      transition={{
        repeat: Number.POSITIVE_INFINITY,
        duration: 1,
        repeatType: "loop",
      }}
    />
    <motion.div
      className="h-2 w-2 bg-primary rounded-full"
      animate={{ scale: [1, 1.2, 1] }}
      transition={{
        repeat: Number.POSITIVE_INFINITY,
        duration: 1,
        delay: 0.2,
        repeatType: "loop",
      }}
    />
    <motion.div
      className="h-2 w-2 bg-primary rounded-full"
      animate={{ scale: [1, 1.2, 1] }}
      transition={{
        repeat: Number.POSITIVE_INFINITY,
        duration: 1,
        delay: 0.4,
        repeatType: "loop",
      }}
    />
  </div>
);

// Message component to display individual messages
const Message = ({
  isUser,
  content,
  isLoading,
  onCopy,
  avatar,
}: {
  isUser: boolean;
  content: string;
  isLoading?: boolean;
  onCopy?: () => void;
  avatar?: string;
}) => (
  <motion.div
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    className={`flex items-start gap-3 mb-4 ${isUser ? "justify-end" : ""}`}
  >
    {!isUser && (
      <div className="flex-shrink-0 mt-1">
        <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-primary">
          <Bot className="h-5 w-5" />
        </div>
      </div>
    )}

    <div className={`flex-1 max-w-[80%] ${isUser ? "order-1" : "order-2"}`}>
      <div
        className={`p-3 rounded-lg ${
          isUser ? "bg-primary text-primary-foreground" : "bg-muted"
        }`}
      >
        {isLoading ? (
          <TypingAnimation />
        ) : (
          <div className="relative group">
            <div className="prose prose-sm dark:prose-invert max-w-none">
              <ReactMarkdown>{content}</ReactMarkdown>
            </div>
            {!isUser && content && onCopy && (
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="absolute top-0 right-0 h-7 w-7 opacity-0 group-hover:opacity-100 transition-opacity"
                      onClick={onCopy}
                    >
                      <Clipboard className="h-3.5 w-3.5" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Copy to clipboard</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            )}
          </div>
        )}
      </div>
    </div>

    {isUser && (
      <div className="flex-shrink-0 mt-1 order-3">
        <Avatar className="h-8 w-8">
          <AvatarImage src={`data:image/jpeg;base64,${avatar}`} />
          <AvatarFallback>
            <User className="h-4 w-4" />
          </AvatarFallback>
        </Avatar>
      </div>
    )}
  </motion.div>
);

function AskAI({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  const [prompt, setPrompt] = useState("");
  const [loading, setLoading] = useState(false);
  const [conversations, setConversations] = useState<
    { prompt: string; response: string }[]
  >([]);
  const inputRef = useRef<HTMLInputElement>(null);
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const [charCount, setCharCount] = useState(0);
  const MAX_CHAR_COUNT = 500;

  const { userData } = useSelector((state: RootState) => state.user);

  useEffect(() => {
    if (open) setTimeout(() => inputRef.current?.focus(), 100);
  }, [open]);

  useEffect(() => {
    // Scroll to bottom when new messages are added
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight;
    }
  }, [conversations]);

  const handleAskAI = async () => {
    if (!prompt.trim() || loading) return;

    setLoading(true);
    setConversations([...conversations, { prompt, response: "" }]);
    setPrompt("");
    setCharCount(0);

    try {
      const res = await axios.post(
        `${getBaseUrl()}/KSA/GenerateAIPromptAsync?text=${encodeURIComponent(
          prompt
        )}`
      );

      const response = res?.data;
      setConversations((prev) =>
        prev.map((c, i) => (i === prev.length - 1 ? { ...c, response } : c))
      );
    } catch (error) {
      toast.error("Failed to get a response. Please try again.");
      // Remove the last conversation if there was an error
      setConversations((prev) => prev.slice(0, -1));
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success("Copied to clipboard!");
  };

  const handleClearConversations = () => {
    setConversations([]);
    toast.success("Conversation cleared");
  };

  const handleSuggestedPrompt = (text: string) => {
    setPrompt(text);
    inputRef.current?.focus();
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (value.length <= MAX_CHAR_COUNT) {
      setPrompt(value);
      setCharCount(value.length);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-md md:min-w-[700px] p-0 gap-0 overflow-hidden h-[80vh] max-h-[600px] flex flex-col">
        <DialogHeader className="p-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white flex flex-row justify-between items-center">
          <DialogTitle className="text-xl font-bold flex items-center gap-2">
            <Bot className="h-6 w-6" /> Naturub AI Assistant
          </DialogTitle>
          {conversations.length > 0 && (
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={handleClearConversations}
                    className="text-white hover:bg-white/20"
                  >
                    <RefreshCcw className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Clear conversation</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          )}
        </DialogHeader>

        <div className="flex-1 overflow-hidden">
          <ScrollArea className="h-full p-4" ref={scrollAreaRef}>
            {conversations.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full">
                <div className="mb-6 text-center">
                  <div className="bg-primary/10 p-3 rounded-full inline-block mb-3">
                    <Sparkles className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="text-lg font-medium mb-1">
                    How can I help you today?
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    Ask me anything or try one of the suggestions below
                  </p>
                </div>

                <div className="grid grid-cols-1 gap-2 w-full max-w-md">
                  {SUGGESTED_PROMPTS.map((item, index) => (
                    <Button
                      key={index}
                      variant="outline"
                      className="justify-start text-left h-auto py-3"
                      onClick={() => handleSuggestedPrompt(item.text)}
                    >
                      <span className="mr-2">{item.icon}</span>
                      {item.text}
                    </Button>
                  ))}
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                {conversations.map((conv, index) => (
                  <div key={index} className="space-y-4">
                    <Message
                      isUser={true}
                      content={conv.prompt}
                      avatar={userData?.ImageBase64}
                    />
                    <Message
                      isUser={false}
                      content={conv.response}
                      isLoading={index === conversations.length - 1 && loading}
                      onCopy={() => handleCopy(conv.response)}
                    />
                  </div>
                ))}
              </div>
            )}
          </ScrollArea>
        </div>

        <div className="p-4 border-t">
          <div className="relative">
            <Input
              ref={inputRef}
              placeholder="Ask something..."
              value={prompt}
              onChange={handleInputChange}
              onKeyDown={(e) =>
                e.key === "Enter" && !e.shiftKey && handleAskAI()
              }
              className="pr-24"
              disabled={loading}
            />
            <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-2">
              <span
                className={`text-xs ${
                  charCount > MAX_CHAR_COUNT * 0.8
                    ? "text-orange-500"
                    : "text-muted-foreground"
                }`}
              >
                {charCount}/{MAX_CHAR_COUNT}
              </span>
              <Button
                size="sm"
                className="h-8 px-3"
                onClick={handleAskAI}
                disabled={loading || !prompt.trim()}
              >
                {loading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Send className="h-4 w-4" />
                )}
              </Button>
            </div>
          </div>
          <div className="mt-2 text-xs text-muted-foreground">
            Press Enter to send your message
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default memo(AskAI);
