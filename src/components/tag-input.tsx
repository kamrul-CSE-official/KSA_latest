"use client"

import { useState, type KeyboardEvent } from "react"
import { X } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"

interface TagInputProps {
  value: string[]
  onChange: (tags: string[]) => void
  placeholder?: string
  maxTags?: number
}

export default function TagInput({ value, onChange, placeholder, maxTags = 10 }: TagInputProps) {
  const [inputValue, setInputValue] = useState("")

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault()
      addTag()
    } else if (e.key === "Backspace" && inputValue === "" && value.length > 0) {
      removeTag(value.length - 1)
    }
  }

  const addTag = () => {
    const tag = inputValue.trim().toLowerCase()

    if (tag && !value.includes(tag) && value.length < maxTags) {
      onChange([...value, tag])
      setInputValue("")
    }
  }

  const removeTag = (index: number) => {
    const newTags = [...value]
    newTags.splice(index, 1)
    onChange(newTags)
  }

  return (
    <div className="flex flex-wrap gap-2 p-2 border rounded-md bg-background">
      {value.map((tag, index) => (
        <Badge key={index} variant="secondary" className="flex items-center gap-1">
          {tag}
          <button type="button" onClick={() => removeTag(index)} className="rounded-full hover:bg-muted p-0.5">
            <X className="h-3 w-3" />
            <span className="sr-only">Remove {tag}</span>
          </button>
        </Badge>
      ))}
      <Input
        type="text"
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        onKeyDown={handleKeyDown}
        onBlur={addTag}
        placeholder={value.length === 0 ? placeholder : undefined}
        className="flex-1 min-w-[120px] border-0 p-0 focus-visible:ring-0 focus-visible:ring-offset-0"
      />
    </div>
  )
}
