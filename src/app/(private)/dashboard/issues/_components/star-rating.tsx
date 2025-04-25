"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Star } from "lucide-react"
import { cn } from "@/lib/utils"

interface StarRatingProps {
  rating: number
  onRatingChange?: (rating: number) => void
  readonly?: boolean
  size?: "default" | "sm"
  className?: string
}

export default function StarRating({
  rating,
  onRatingChange,
  readonly = false,
  size = "default",
  className,
}: StarRatingProps) {
  const [hoverRating, setHoverRating] = useState(0)

  const handleClick = (index: number) => {
    if (readonly) return
    // Toggle off if clicking the same star
    const newRating = rating === index ? index - 1 : index
    onRatingChange?.(newRating)
  }

  const handleMouseEnter = (index: number) => {
    if (readonly) return
    setHoverRating(index)
  }

  const handleMouseLeave = () => {
    if (readonly) return
    setHoverRating(0)
  }

  const starSize = size === "sm" ? "h-3 w-3" : "h-4 w-4"

  return (
    <div className={cn("flex", className)}>
      {[1, 2, 3, 4, 5].map((index) => {
        const isActive = (hoverRating || rating) >= index

        return (
          <motion.button
            key={index}
            type="button"
            whileTap={{ scale: readonly ? 1 : 0.8 }}
            className={`p-0.5 focus:outline-none ${readonly ? "cursor-default" : "cursor-pointer"}`}
            onClick={() => handleClick(index)}
            onMouseEnter={() => handleMouseEnter(index)}
            onMouseLeave={handleMouseLeave}
            disabled={readonly}
          >
            <Star
              className={cn(
                starSize,
                isActive ? "fill-yellow-400 text-yellow-400" : "text-gray-300 dark:text-gray-600",
              )}
            />
          </motion.button>
        )
      })}
    </div>
  )
}
