"use client"

import type React from "react"
import { type ReactNode, useState, useCallback, memo } from "react"
import { motion } from "framer-motion"
import EmojiPicker, { type EmojiClickData, Theme } from "emoji-picker-react"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"

interface EmojiPickerComponentProps {
  children: ReactNode
  setEmojiIcon: (emoji: string) => void
}

const EmojiPickerComponent: React.FC<EmojiPickerComponentProps> = ({ children, setEmojiIcon }) => {
  const [open, setOpen] = useState(false)

  // Handle emoji selection
  const handleEmojiClick = useCallback(
    (emojiData: EmojiClickData) => {
      setEmojiIcon(emojiData.emoji) // Set the selected emoji
      setOpen(false) // Close the emoji picker
    },
    [setEmojiIcon],
  )

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <div className="cursor-pointer">{children}</div>
      </PopoverTrigger>
      <PopoverContent
        className="p-0 border-none shadow-xl"
        side="bottom"
        align="start"
        sideOffset={5}
        style={{ width: "auto", maxWidth: "350px" }}
      >
        <motion.div
          initial={{ opacity: 0, y: -5 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -5 }}
          transition={{ duration: 0.15 }}
          className="emoji-picker-container"
        >
          <EmojiPicker
            onEmojiClick={handleEmojiClick}
            lazyLoadEmojis={true}
            searchPlaceHolder="Search emoji..."
            width="100%"
            height="350px"
            skinTonesDisabled
            previewConfig={{
              showPreview: true,
              defaultCaption: "Pick an emoji for your workspace",
            }}
          />
        </motion.div>
      </PopoverContent>
    </Popover>
  )
}

export default memo(EmojiPickerComponent)

