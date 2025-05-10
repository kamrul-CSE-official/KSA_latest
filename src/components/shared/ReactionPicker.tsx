"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import Lottie from "lottie-react";
import LikeAnimation from "../../../public/assets/lottie/like.json";
import CelebrateAnimation from "../../../public/assets/lottie/celebrate.json";
import SupportAnimation from "../../../public/assets/lottie/support.json";
import InsightfulAnimation from "../../../public/assets/lottie/insightful.json";
import AppreciateAnimation from "../../../public/assets/lottie/Appreciate.json";
import UnLikeAnimation from "../../../public/assets/lottie/unlike.json";

type ReactionOption = {
  id: string;
  label: string;
  activeColor: string;
  hoverColor: string;
  count: number;
  lottieAnimation: unknown;
};

const REACTION_OPTIONS: ReactionOption[] = [
  {
    id: "like",
    label: "Like",
    activeColor:
      "text-blue-600 dark:text-blue-400 bg-blue-100 dark:bg-blue-900/30",
    hoverColor: "group-hover:text-blue-600 dark:group-hover:text-blue-400",
    count: 24,
    lottieAnimation: LikeAnimation,
  },
  {
    id: "Dislike",
    label: "Dislike",
    activeColor: "text-red-600 dark:text-red-400 bg-red-100 dark:bg-red-900/30",
    hoverColor: "group-hover:text-red-600 dark:group-hover:text-red-400",
    count: 24,
    lottieAnimation: UnLikeAnimation,
  },
  {
    id: "celebrate",
    label: "Celebrate",
    activeColor:
      "text-amber-600 dark:text-amber-400 bg-amber-100 dark:bg-amber-900/30",
    hoverColor: "group-hover:text-amber-600 dark:group-hover:text-amber-400",
    count: 5,
    lottieAnimation: CelebrateAnimation,
  },
  {
    id: "support",
    label: "Support",
    activeColor:
      "text-purple-600 dark:text-purple-400 bg-purple-100 dark:bg-purple-900/30",
    hoverColor: "group-hover:text-purple-600 dark:group-hover:text-purple-400",
    count: 7,
    lottieAnimation: SupportAnimation,
  },
  {
    id: "insightful",
    label: "Insightful",
    activeColor:
      "text-yellow-600 dark:text-yellow-400 bg-yellow-100 dark:bg-yellow-900/30",
    hoverColor: "group-hover:text-green-600 dark:group-hover:text-green-400",
    count: 12,
    lottieAnimation: InsightfulAnimation,
  },
  {
    id: "appreciate",
    label: "Appreciate",
    activeColor:
      "text-green-600 dark:text-red-400 bg-green-100 dark:bg-green-900/30",
    hoverColor: "group-hover:text-red-600 dark:group-hover:text-red-400",
    count: 3,
    lottieAnimation: AppreciateAnimation,
  },
];

type ReactionPickerProps = {
  initialReaction?: string | null;
  onReactionSelect?: (reactionId: string | null) => void;
  showCounts?: boolean;
  className?: string;
  totalReactions: number;
  isCurrentUserReact: boolean;
  reactionType?: number;
  onClick?: () => void;
};

const REACTION_ANIMATION_DURATION = 1500;
const HOVER_DELAY = 200;
const HOVER_LEAVE_DELAY = 100;

export default function ReactionPicker({
  initialReaction = null,
  onReactionSelect,
  showCounts = true,
  className,
  totalReactions = 0,
  isCurrentUserReact = false,
  reactionType = 0,
}: ReactionPickerProps) {
  const [selected, setSelected] = useState<string | null>(initialReaction);
  const [showReactionBar, setShowReactionBar] = useState(false);
  const [hoverTimeout, setHoverTimeout] = useState<NodeJS.Timeout | null>(null);
  const [hoveredReaction, setHoveredReaction] = useState<string | null>(null);
  const [playingAnimation, setPlayingAnimation] = useState<string | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const selectedReaction = selected
    ? REACTION_OPTIONS.find((r) => r.id === selected)
    : null;

  const handleMouseEnter = () => {
    const timeout = setTimeout(() => {
      setShowReactionBar(true);
    }, HOVER_DELAY);
    setHoverTimeout(timeout);
  };

  const handleMouseLeave = () => {
    if (hoverTimeout) {
      clearTimeout(hoverTimeout);
      setHoverTimeout(null);
    }

    setTimeout(() => {
      setShowReactionBar(false);
      setHoveredReaction(null);
    }, HOVER_LEAVE_DELAY);
  };

  const handleReactionSelect = (reactionId: string) => {
    setPlayingAnimation(reactionId);
    setTimeout(() => setPlayingAnimation(null), REACTION_ANIMATION_DURATION);

    const newSelected = reactionId === selected ? null : reactionId;
    setSelected(newSelected);
    onReactionSelect?.(newSelected);
    setShowReactionBar(false);
  };

  // Close reaction bar when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setShowReactionBar(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className={cn("relative", className)} ref={containerRef}>
      {/* Reaction counts display */}
      {showCounts && totalReactions > 0 && (
        <div className="py-2 flex items-center text-xs text-gray-500 dark:text-gray-400">
          <div className="flex -space-x-1 mr-2">
            {REACTION_OPTIONS.slice(0, 3).map((reaction, i) => (
              <div
                key={reaction.id}
                className={cn(
                  "w-4 h-4 rounded-full flex items-center justify-center border border-white dark:border-gray-800",
                  reaction.activeColor
                )}
                style={{ zIndex: 3 - i }}
              >
                <Lottie
                  animationData={reaction.lottieAnimation}
                  loop={true}
                  autoplay={false}
                  style={{ width: 16, height: 16 }}
                  initialSegment={[10, 20]}
                />
              </div>
            ))}
          </div>
          <span className="cursor-pointer hover:text-gray-700 dark:hover:text-gray-300">
            {totalReactions == 1 && isCurrentUserReact
              ? "Only you"
              : totalReactions == 0 && !isCurrentUserReact
              ? "00"
              : `${isCurrentUserReact ? "You and " : ""}${totalReactions}`}
          </span>
        </div>
      )}

      {/* Reaction button */}
      <div
        className="border-gray-200 dark:border-gray-700 flex w-fit"
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        <Button
          variant="ghost"
          size="sm"
          className={cn(
            selected
              ? selectedReaction?.activeColor
              : "text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
          )}
          onClick={() => handleReactionSelect(selected || "like")}
        >
          {playingAnimation && playingAnimation === selected ? (
            <div className="w-8 h-8">
              <Lottie
                animationData={selectedReaction?.lottieAnimation}
                loop={false}
                autoplay={true}
                className="w-full h-full"
              />
            </div>
          ) : selected ? (
            <>
              <motion.div
                initial={{ scale: 0.8 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 400, damping: 10 }}
                className="w-5 h-5"
              >
                <Lottie
                  animationData={selectedReaction?.lottieAnimation}
                  loop={true}
                  autoplay={false}
                  className="w-full h-full"
                />
              </motion.div>
              <span>{selectedReaction?.label}</span>
            </>
          ) : (
            <>
              <div className="w-5 h-5">
                <Lottie
                  animationData={
                    REACTION_OPTIONS[reactionType | 0].lottieAnimation
                  }
                  loop={true}
                  autoplay={false}
                  initialSegment={[0, 15]}
                  className="w-full h-full"
                />
              </div>
              <span>Like</span>
            </>
          )}
        </Button>

        {/* Floating reaction bar */}
        <AnimatePresence>
          {showReactionBar && (
            <motion.div
              className="absolute -top-6 left-0 bg-white dark:bg-gray-800 rounded-full shadow-lg border border-gray-200 dark:border-gray-700 flex p-1 z-10"
              initial={{ opacity: 0, y: 10, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{
                opacity: 0,
                y: 10,
                scale: 0.9,
                transition: { duration: 0.15 },
              }}
              transition={{
                duration: 0.2,
                type: "spring",
                stiffness: 400,
                damping: 25,
              }}
            >
              {REACTION_OPTIONS.map((reaction, index) => (
                <motion.button
                  key={reaction.id}
                  className={cn(
                    "group flex flex-col items-center justify-center p-1.5 rounded-full relative",
                    reaction.id === selected
                      ? reaction.activeColor
                      : "hover:bg-gray-100 dark:hover:bg-gray-700"
                  )}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{
                    opacity: 1,
                    y: 0,
                    transition: { delay: index * 0.03 },
                  }}
                  whileHover={{
                    scale: 1.2,
                    transition: { type: "spring", stiffness: 400, damping: 10 },
                  }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handleReactionSelect(reaction.id)}
                  onMouseEnter={() => setHoveredReaction(reaction.id)}
                  onMouseLeave={() => setHoveredReaction(null)}
                >
                  <div className="w-8 h-8">
                    <Lottie
                      animationData={reaction.lottieAnimation}
                      loop={true}
                      autoplay={true}
                      className="w-full h-full"
                    />
                  </div>
                  <AnimatePresence>
                    {hoveredReaction === reaction.id && (
                      <motion.span
                        className="absolute bottom-full mb-1 text-xs font-medium bg-gray-800 dark:bg-gray-700 text-white dark:text-gray-200 py-0.5 px-1.5 rounded whitespace-nowrap pointer-events-none"
                        initial={{ opacity: 0, y: 5 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 5 }}
                        transition={{ duration: 0.1 }}
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
