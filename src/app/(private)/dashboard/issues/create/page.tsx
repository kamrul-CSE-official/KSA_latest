"use client"

import { useState } from "react"
import { ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"
import CreateIssueForm from "./_components/create-issue-form"
import { useRouter } from "next/navigation"

interface IssueFormData {
  title: string
  content: string
  summary: string
  tags: string[]
}

export default function CreateIssuePage() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const route = useRouter();

  const handleSubmit = async (formData: IssueFormData) => {
    setIsSubmitting(true)
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 2000))

      console.log("Issue data:", formData)
      toast.success("Successfully created an issue!")

      // In a real app, you would navigate back or to the issues list
      // router.push("/dashboard/issues")
    } catch (error) {
      console.error("Failed to create issue:", error)
      toast.error("Failed to create issue. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleGoBack = () => {
    route.push("/dashboard/issues/")
  }

  return (
    <div className="min-h-screen">
      <div>
        <Button
          variant="ghost"
          onClick={handleGoBack}
          className="mb-1 text-slate-600 hover:text-slate-900 hover:bg-slate-200/50"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back
        </Button>



        <CreateIssueForm onSubmit={handleSubmit} isSubmitting={isSubmitting} />
      </div>
    </div>
  )
}
