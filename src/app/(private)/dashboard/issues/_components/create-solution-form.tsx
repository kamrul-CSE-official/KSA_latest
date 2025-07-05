"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import TipTapEditor from "@/components/tiptap-editor"
import type { Solution } from "@/types/globelTypes"
import { useSelector } from "react-redux"
import { RootState } from "@/redux/store"

interface CreateSolutionFormProps {
  onSubmit: (solution: Solution) => void
  onCancel: () => void
}

export default function CreateSolutionForm({ onSubmit, onCancel }: CreateSolutionFormProps) {
  const [content, setContent] = useState("");

  const userDetails = useSelector((state: RootState)=> state.user.userData);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!content.trim()) {
      return
    }

    const newSolution: Solution = {
      content,
      createdAt: new Date().toISOString(),
      UPDATED_AT: new Date().toISOString(),
      USER_ID: userDetails?.EmpID!
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
