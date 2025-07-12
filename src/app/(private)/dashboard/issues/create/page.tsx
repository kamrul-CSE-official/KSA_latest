"use client"

import { useState } from "react"
import { ArrowLeft } from "lucide-react"
import { useRouter } from "next/navigation"
import { useSelector } from "react-redux"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import CreateIssueForm from "./_components/create-issue-form"
import { useCreateAIssueMutation } from "@/redux/services/issuesApi"
import { RootState } from "@/redux/store"

interface IssueFormData {
  title: string
  content: string
  tags: string[]
  summary: string
  files?: string[]
  fileTypes?: string[]
}

export default function CreateIssuePage() {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const userDetails = useSelector((state: RootState) => state.user.userData)
  const [createIssue] = useCreateAIssueMutation()

  const handleSubmit = async (formData: IssueFormData) => {
    if (!userDetails) {
      toast.error("User information not available")
      return
    }

    setIsSubmitting(true)



    try {
      const response = await createIssue({
        TITLE: formData?.title,
        SUMMARY: formData?.summary,
        CONTENT: formData?.content,
        USER_ID: userDetails?.EmpID,
        COMPANY_ID: userDetails?.CompanyID,
        TAGS: formData?.tags,
        Files: formData?.files,
        FileTypes: formData?.fileTypes,
      }).unwrap()

      if (response[0].ID) {
        toast.success("Issue created successfully!")
        // router.push(`/dashboard/issues/issue/?issueId=${encrypt(response.Id)}`)
        router.push(`/dashboard/issues`)
      }
    } catch (error) {
      console.error("Issue creation failed:", error)
      toast.error("Failed to create incidents. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleGoBack = () => {
    router.push("/dashboard/issues/")
  }

  return (
    <div className="min-h-screen p-4">
      <Button
        variant="ghost"
        onClick={handleGoBack}
        className="mb-4 text-slate-600 hover:text-slate-900 hover:bg-slate-200/50"
      >
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to Incident
      </Button>

      <CreateIssueForm
        onSubmit={handleSubmit}
        isSubmitting={isSubmitting}
      />
    </div>
  )
}