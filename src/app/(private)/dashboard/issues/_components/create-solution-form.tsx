"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import TipTapEditor from "@/components/tiptap-editor"
import type { Solution } from "@/types/globelTypes"

interface CreateSolutionFormProps {
  onSubmit: (solution: Solution) => void
  onCancel: () => void
}

export default function CreateSolutionForm({ onSubmit, onCancel }: CreateSolutionFormProps) {
  const [content, setContent] = useState("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!content.trim()) {
      return
    }

    const newSolution: Solution = {
      id: Date.now().toString(),
      author: {
        id: "current-user",
        name: "You",
        avatar: "/placeholder.svg?height=40&width=40",
      },
      content,
      createdAt: new Date().toISOString(),
      votes: 0,
      reviews: [],
      replies: [],
    }

    onSubmit(newSolution)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <TipTapEditor content={content} onChange={setContent} placeholder="Write your solution here..." />

      <div className="flex justify-end gap-2">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" disabled={!content.trim()}>
          Post Solution
        </Button>
      </div>
    </form>
  )
}
