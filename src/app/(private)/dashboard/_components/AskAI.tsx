"use client";

import { useState, useRef, useEffect, memo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Bot, Loader2, Clipboard, Zap } from "lucide-react";
import { toast } from "sonner";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import axios from "axios";
import { getBaseUrl } from "@/config/envConfig";

function AskAI({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  const [prompt, setPrompt] = useState("");
  const [loading, setLoading] = useState(false);
  const [conversations, setConversations] = useState<
    { prompt: string; response: string }[]
  >([]);
  const inputRef = useRef<HTMLInputElement>(null);

  const { userData } = useSelector((state: RootState) => state.user);

  useEffect(() => {
    if (open) setTimeout(() => inputRef.current?.focus(), 100);
  }, [open]);

  const handleAskAI = async () => {
    if (!prompt.trim()) return;

    setLoading(true);
    setConversations([...conversations, { prompt, response: "" }]);

    try {
      const prompt =
        "Hey there! 😊 Let's have a fun and engaging conversation. Keep it friendly, natural, and add some cool emojis! 🎉✨";

      const res = await axios.post(
        `${getBaseUrl()}/KSA/GenerateAIPromptAsync?text=${encodeURIComponent(
          prompt
        )}`
      );

      //  console.log("Response from backend::: ",res?.data);

      const response = res?.data;
      setConversations((prev: any) =>
        prev.map((c: any, i: number) =>
          i === prev.length - 1 ? { ...c, response } : c
        )
      );
    } catch {
      toast.error("Something went wrong. Try again.");
    } finally {
      setLoading(false);
      setPrompt("");
    }
  };

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success("Copied to clipboard!");
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-md md:min-w-[700px] p-0 gap-0 overflow-hidden h-[80vh] max-h-[600px]">
        <DialogHeader className="p-6 bg-gradient-to-r from-blue-600 to-purple-600 text-white">
          <DialogTitle className="text-xl font-bold flex items-center gap-2">
            <Bot className="h-6 w-6" /> Naturub AI Assistant
          </DialogTitle>
        </DialogHeader>
        <ScrollArea className="p-4 flex-1 overflow-y-auto">
          <AnimatePresence>
            {conversations.length === 0 ? (
              <div className="text-center text-sm text-muted-foreground">
                Ask me anything or try a suggestion below.
              </div>
            ) : (
              conversations.map((conv, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  {/* User's question */}
                  <div className="flex items-start gap-2">
                    <Avatar>
                      <AvatarImage
                        src={`data:image/jpeg;base64,${userData?.ImageBase64}`}
                      />
                      <AvatarFallback>
                        {userData?.FullName?.substring(0, 1)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="bg-muted p-2 rounded-lg">{conv.prompt}</div>
                  </div>

                  {/* AI Response */}
                  <div className="flex items-start gap-2 mt-2 relative">
                    <Bot className="h-4 w-4 text-primary" />
                    <div className="bg-card p-2 rounded-lg relative w-full">
                      {index === conversations.length - 1 && loading ? (
                        <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
                      ) : (
                        <div className="relative">
                          {conv.response}
                          {/* Copy Button */}
                          <Button
                            variant="ghost"
                            size="icon"
                            className="absolute top-0 right-0 m-2 p-1 text-muted-foreground hover:text-primary"
                            onClick={() => handleCopy(conv.response)}
                          >
                            <Clipboard className="h-4 w-4" />
                          </Button>
                        </div>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))
            )}
          </AnimatePresence>
        </ScrollArea>

        {/* Input & Send Button */}
        <div className="p-4 border-t">
          <Input
            ref={inputRef}
            placeholder="Ask something..."
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleAskAI()}
          />
          <Button
            onClick={handleAskAI}
            disabled={loading}
            className="mt-2 w-full"
          >
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Ask"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default memo(AskAI);
