"use client"

import { useState, type KeyboardEvent } from "react"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { X, Plus } from "lucide-react"

interface TagInputProps {
  value: string[]
  onChange: (tags: string[]) => void
  onBlur?: () => void
  placeholder?: string
  maxTags?: number
  className?: string
}

export default function TagInput({
  value,
  onChange,
  onBlur,
  placeholder = "Add tags...",
  maxTags = 5,
  className = "",
}: TagInputProps) {
  const [inputValue, setInputValue] = useState("")

  const addTag = (tag: string) => {
    const trimmedTag = tag.trim().toLowerCase()
    if (trimmedTag && !value.includes(trimmedTag) && value.length < maxTags) {
      onChange([...value, trimmedTag])
      setInputValue("")
    }
  }

  const removeTag = (tagToRemove: string) => {
    onChange(value.filter((tag) => tag !== tagToRemove))
  }

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault()
      addTag(inputValue)
    } else if (e.key === "Backspace" && !inputValue && value.length > 0) {
      removeTag(value[value.length - 1])
    }
  }

  const handleInputBlur = () => {
    if (inputValue.trim()) {
      addTag(inputValue)
    }
    onBlur?.()
  }

  const suggestedTags = [
    "bug",
    "feature",
    "enhancement",
    "documentation",
    "question",
    "help-wanted",
    "good-first-issue",
    "priority-high",
    "priority-low",
  ]

  const availableSuggestions = suggestedTags.filter((tag) => !value.includes(tag))

  return (
    <div className={`space-y-3 ${className}`}>
      {/* Current Tags */}
      {value.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {value.map((tag) => (
            <Badge
              key={tag}
              variant="secondary"
              className="bg-gradient-to-r from-blue-100 to-purple-100 text-blue-800 hover:from-blue-200 hover:to-purple-200 transition-all duration-200 px-3 py-1"
            >
              {tag}
              <button
                type="button"
                onClick={() => removeTag(tag)}
                className="ml-2 hover:text-blue-600 transition-colors"
              >
                <X className="h-3 w-3" />
              </button>
            </Badge>
          ))}
        </div>
      )}

      {/* Input */}
      <div className="relative">
        <Input
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleKeyDown}
          onBlur={handleInputBlur}
          placeholder={value.length >= maxTags ? `Maximum ${maxTags} tags reached` : placeholder}
          disabled={value.length >= maxTags}
          className="pr-10 transition-all duration-200"
        />
        <Plus className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
      </div>

      {/* Suggested Tags */}
      {value.length < maxTags && availableSuggestions.length > 0 && (
        <div className="space-y-2">
          <p className="text-sm text-slate-600 font-medium">Suggested tags:</p>
          <div className="flex flex-wrap gap-2">
            {availableSuggestions.slice(0, 6).map((tag) => (
              <Badge
                key={tag}
                variant="outline"
                className="cursor-pointer hover:bg-slate-100 transition-colors text-xs"
                onClick={() => addTag(tag)}
              >
                <Plus className="h-3 w-3 mr-1" />
                {tag}
              </Badge>
            ))}
          </div>
        </div>
      )}

      {/* Helper Text */}
      <p className="text-xs text-slate-500">Press Enter or comma to add tags. Use backspace to remove the last tag.</p>
    </div>
  )
}
