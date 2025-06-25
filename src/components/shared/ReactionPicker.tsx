"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Lottie from "lottie-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

import Like from "@/../public/assets/lottie/like.json";
import Dislike from "@/../public/assets/lottie/unlike.json";
import Celebrate from "@/../public/assets/lottie/celebrate.json";
import Support from "@/../public/assets/lottie/support.json";
import Insightful from "@/../public/assets/lottie/insightful.json";
import Appreciate from "@/../public/assets/lottie/Appreciate.json";

const REACTIONS = [
  { label: "Like", color: "blue", animation: Like },
  { label: "Dislike", color: "red", animation: Dislike },
  { label: "Celebrate", color: "amber", animation: Celebrate },
  { label: "Support", color: "purple", animation: Support },
  { label: "Insightful", color: "yellow", animation: Insightful },
  { label: "Appreciate", color: "green", animation: Appreciate },
] as const;

type ReactionType = typeof REACTIONS[number];

interface Props {
  className?: string;
  onChange?: (reaction: string | null) => void;
  defaultReaction?: string | null;
  showCounts?: boolean;
  totalReactions?: number;
  isCurrentUserReact?: boolean;
}

export default function ReactionPicker({
  className,
  onChange,
  defaultReaction = null,
  showCounts = true,
  totalReactions = 0,
  isCurrentUserReact = false,
}: Props) {
  const [selected, setSelected] = useState<string | null>(defaultReaction);
  const [showBar, setShowBar] = useState(false);
  const [playing, setPlaying] = useState<string | null>(null);
  const [hovered, setHovered] = useState<string | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const selectedReaction = REACTIONS.find(r => r.label === selected);

  const handleReaction = useCallback((label: string) => {
    const newSelection = selected === label ? null : label;
    setSelected(newSelection);
    onChange?.(newSelection);
    setPlaying(label);
    setTimeout(() => setPlaying(null), 1500);
    setShowBar(false);
  }, [selected]);

  useEffect(() => {
    const clickOutside = (e: MouseEvent) => {
      if (!containerRef.current?.contains(e.target as Node)) {
        setShowBar(false);
        setHovered(null);
      }
    };
    document.addEventListener("mousedown", clickOutside);
    return () => document.removeEventListener("mousedown", clickOutside);
  }, []);

  return (
    <div className={cn("relative", className)} ref={containerRef}>
      {showCounts && totalReactions > 0 && (
        <div className="flex items-center text-sm text-gray-500 mb-2">
          <div className="flex -space-x-1 mr-2">
            {REACTIONS.slice(0, 3).map((r, i) => (
              <div
                key={r.label}
                className={`w-5 h-5 rounded-full bg-${r.color}-100 border`}
                style={{ zIndex: 3 - i }}
              >
                <Lottie
                  animationData={r.animation}
                  loop
                  autoplay={false}
                  style={{ width: 20, height: 20 }}
                />
              </div>
            ))}
          </div>
          <span>
            {totalReactions === 1 && isCurrentUserReact
              ? "Only you"
              : `${isCurrentUserReact ? "You and " : ""}${totalReactions}`}
          </span>
        </div>
      )}

      <div
        className="inline-flex"
        onMouseEnter={() => setShowBar(true)}
        onMouseLeave={() => setShowBar(false)}
      >
        <Button
          variant="ghost"
          size="sm"
          className={cn(
            selectedReaction
              ? `bg-${selectedReaction.color}-100 text-${selectedReaction.color}-600`
              : "text-gray-600 dark:text-gray-300 hover:bg-muted"
          )}
          onClick={() => handleReaction(selected || "Like")}
        >
          {playing && playing === selected ? (
            <div className="w-6 h-6">
              <Lottie animationData={selectedReaction?.animation} loop={false} autoplay />
            </div>
          ) : selected ? (
            <>
              <div className="w-5 h-5 mr-1">
                <Lottie animationData={selectedReaction?.animation} loop autoplay={false} />
              </div>
              <span>{selected}</span>
            </>
          ) : (
            <>
              <div className="w-5 h-5 mr-1">
                <Lottie animationData={Like} loop autoplay={false} />
              </div>
              <span>React</span>
            </>
          )}
        </Button>

        <AnimatePresence>
          {showBar && (
            <motion.div
              initial={{ opacity: 0, y: 10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.95 }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
              className="absolute -top-10 left-0 bg-white dark:bg-muted border shadow rounded-full px-2 py-1 flex gap-2 z-10"
            >
              {REACTIONS.map((reaction, i) => (
                <motion.button
                  key={reaction.label}
                  className={cn(
                    "group p-1.5 rounded-full",
                    selected === reaction.label
                      ? `bg-${reaction.color}-100`
                      : "hover:bg-gray-200 dark:hover:bg-gray-700"
                  )}
                  onClick={() => handleReaction(reaction.label)}
                  onMouseEnter={() => setHovered(reaction.label)}
                  onMouseLeave={() => setHovered(null)}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.03 }}
                >
                  <div className="w-6 h-6">
                    <Lottie animationData={reaction.animation} loop autoplay />
                  </div>
                  <AnimatePresence>
                    {hovered === reaction.label && (
                      <motion.span
                        className="absolute bottom-full mb-1 bg-gray-800 text-white text-xs px-2 py-1 rounded"
                        initial={{ opacity: 0, y: 5 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 5 }}
                      >
                        {reaction.label}
                      </motion.span>
                    )}
                  </AnimatePresence>
                </motion.button>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
