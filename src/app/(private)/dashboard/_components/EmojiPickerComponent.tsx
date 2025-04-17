"use client";

import { type ReactNode, useState, useCallback, memo } from "react";
import { motion } from "framer-motion";
import EmojiPicker, { type EmojiClickData } from "emoji-picker-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

interface EmojiPickerComponentProps {
  children: ReactNode;
  setEmojiIcon: (emoji: string) => void;
}

const EmojiPickerComponent = memo(({
  children,
  setEmojiIcon,
}: EmojiPickerComponentProps) => {
  const [open, setOpen] = useState(false);

  const handleEmojiClick = useCallback((emojiData: EmojiClickData) => {
    setEmojiIcon(emojiData.emoji);
    setOpen(false);
  }, [setEmojiIcon]);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <div className="cursor-pointer relative z-[50]">
          {children}
        </div>
      </PopoverTrigger>
      <PopoverContent
        className="p-0 border-none shadow-xl w-auto"
        side="bottom"
        align="start"
        sideOffset={5}
        style={{ zIndex: 1000 }} // Higher than CoverPicker's dialog
      >
        <motion.div
          initial={{ opacity: 0, y: -5 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -5 }}
          transition={{ duration: 0.15 }}
        >
          <EmojiPicker
            onEmojiClick={handleEmojiClick}
            lazyLoadEmojis
            searchPlaceHolder="Search emoji..."
            width={350}
            height={350}
            skinTonesDisabled
            previewConfig={{
              showPreview: true,
              defaultCaption: "Pick an emoji for your workspace",
            }}
          />
        </motion.div>
      </PopoverContent>
    </Popover>
  );
});

EmojiPickerComponent.displayName = "EmojiPickerComponent";

export default EmojiPickerComponent;