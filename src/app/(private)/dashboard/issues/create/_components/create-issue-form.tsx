"\"use client"

import type React from "react"
import { useState, useCallback } from "react"
import { Save, FileText, Tag, AlertCircle, Loader2, CheckCircle, Sparkles, Lightbulb, Upload } from "lucide-react"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import TagInput from "./tag-input"
import TemplateSelector from "../../issue/_components/TemplateSelector"
import RichTextEditor from "./rich-text-editor"
import FileUpload from "./file-upload"


interface CreateIssueFormProps {
  onSubmit: (formData: FormData) => void
  isSubmitting: boolean
}

interface FormData {
  title: string
  content: string
  tags: string[]
  summary: string
  files?: string[]
  fileTypes?: string[]
}

interface FormErrors {
  title?: string
  content?: string
  tags?: string
  summary?: string
  uploadedFiles?: string[]
}

export default function CreateIssueForm({ onSubmit, isSubmitting }: CreateIssueFormProps) {
  const [title, setTitle] = useState("")
  const [summary, setSummary] = useState("")
  const [content, setContent] = useState("")
  const [tags, setTags] = useState<string[]>([])
  const [errors, setErrors] = useState<FormErrors>({})
  const [touched, setTouched] = useState<Record<string, boolean>>({})
  const [uploadedFiles, setUploadedFiles] = useState<any[]>([])


  const MAX_TITLE_LENGTH = 100
  const MIN_CONTENT_LENGTH = 20
  const MAX_SUMMARY_LENGTH = 1000

  const validateForm = useCallback((): FormErrors => {
    const newErrors: FormErrors = {}

    if (!title.trim()) {
      newErrors.title = "Title is required"
    } else if (title.length > MAX_TITLE_LENGTH) {
      newErrors.title = `Title must be ${MAX_TITLE_LENGTH} characters or less`
    }

    if (!summary.trim()) {
      newErrors.summary = "Summary is required"
    } else if (summary.length > MAX_SUMMARY_LENGTH) {
      newErrors.summary = `Summary must be ${MAX_SUMMARY_LENGTH} characters or less`
    }

    if (!content.trim()) {
      newErrors.content = "Description is required"
    } else if (content.length < MIN_CONTENT_LENGTH) {
      newErrors.content = `Description must be at least ${MIN_CONTENT_LENGTH} characters`
    }

    if (tags.length === 0) {
      newErrors.tags = "At least one tag is required"
    }

    return newErrors
  }, [title, summary, content, tags])

  const isFormValid = Object.keys(validateForm()).length === 0

  const handleBlur = (field: keyof FormErrors) => {
    setTouched((prev) => ({ ...prev, [field]: true }))
    const newErrors = validateForm()
    setErrors((prev) => ({ ...prev, [field]: newErrors[field] }))
  }

  const handleChange = (field: keyof FormErrors, value: string) => {
    switch (field) {
      case "title":
        setTitle(value)
        break
      case "summary":
        setSummary(value)
        break
      case "content":
        setContent(value)
        break
    }

    if (touched[field]) {
      const newErrors = validateForm()
      setErrors((prev) => ({ ...prev, [field]: newErrors[field] }))
    }
  }

  const handleTagsChange = (newTags: string[]) => {
    setTags(newTags)
    if (touched.tags) {
      const newErrors = validateForm()
      setErrors((prev) => ({ ...prev, tags: newErrors.tags }))
    }
  }

  const handleSelectTemplate = (templateContent: string) => {
    setContent(templateContent)
    setTouched((prev) => ({ ...prev, content: true }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const formErrors = validateForm()
    setErrors(formErrors)
    setTouched({ title: true, summary: true, content: true, tags: true })

    if (Object.keys(formErrors).length === 0) {
      onSubmit({
        title: title.trim(),
        content: content.trim(),
        tags,
        summary: summary.trim(),
        files: uploadedFiles?.map((pre) => `https://192.168.1.253:8080/uploads/${pre.url}`),
        fileTypes: uploadedFiles.map(file => file.type)
      })
    }
  }

  return (
    <Card className="shadow-xl border-0 backdrop-blur-sm">
      <CardHeader className="bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-t-lg">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-white/20 rounded-lg">
            <FileText className="h-6 w-6" />
          </div>
          <div>
            <CardTitle className="text-2xl font-bold">Create New Incident</CardTitle>
            <p className="text-blue-100 mt-1">Share your challenge and get help from the community</p>
          </div>
        </div>
      </CardHeader>

      <CardContent className="p-8 space-y-8">
        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Title Section */}
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <Label htmlFor="title" className="text-lg font-semibold text-slate-700 flex items-center gap-2">
                <Lightbulb className="h-5 w-5" />
                Issue Title *
              </Label>
              <Badge variant={title.length > MAX_TITLE_LENGTH ? "destructive" : "secondary"}>
                {title.length}/{MAX_TITLE_LENGTH}
              </Badge>
            </div>
            <Input
              id="title"
              value={title}
              placeholder="e.g., How to increase production efficiency in manufacturing?"
              onChange={(e) => handleChange("title", e.target.value)}
              onBlur={() => handleBlur("title")}
              className={`text-lg h-12 ${errors.title ? "border-red-300 focus:ring-red-200" : "border-slate-300 focus:ring-blue-200"}`}
              required
            />
            {errors.title && <FieldError message={errors.title} />}
          </div>

          {/* Summary Section */}
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <Label htmlFor="summary" className="text-lg font-semibold text-slate-700">
                Quick Summary *
              </Label>
              <Badge variant={summary.length > MAX_SUMMARY_LENGTH ? "destructive" : "secondary"}>
                {summary.length}/{MAX_SUMMARY_LENGTH}
              </Badge>
            </div>
            <Textarea
              id="summary"
              value={summary}
              placeholder="Provide a brief summary of your issue in 1-2 sentences..."
              onChange={(e) => handleChange("summary", e.target.value)}
              onBlur={() => handleBlur("summary")}
              className={`min-h-[100px] ${errors.summary ? "border-red-300 focus:ring-red-200" : "border-slate-300 focus:ring-blue-200"}`}
              required
            />
            {errors.summary && <FieldError message={errors.summary} />}
          </div>

          {/* Template Selector */}
          <div className="space-y-3">
            <Label className="text-lg font-semibold text-slate-700 flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-purple-500" />
              Quick Templates
            </Label>
            <TemplateSelector onSelectTemplate={handleSelectTemplate} />
          </div>

          {/* Rich Text Editor */}
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <Label className="text-lg font-semibold text-slate-700">Detailed Description *</Label>
              <Badge variant={content.length < MIN_CONTENT_LENGTH ? "destructive" : "secondary"}>
                {content.length} characters
              </Badge>
            </div>
            <div className={`rounded-lg border-2 ${errors.content ? "border-red-300" : "border-slate-200"}`}>
              <RichTextEditor
                content={content}
                onChange={(value: any) => handleChange("content", value)}
                placeholder="Describe your issue in detail. Include context, what you've tried, and what outcome you're looking for..."
              />
            </div>
            {errors.content && <FieldError message={errors.content} />}
          </div>

          {/* Tags Section */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Tag className="h-5 w-5 text-green-600" />
              <Label className="text-lg font-semibold text-slate-700">Tags *</Label>
            </div>
            <TagInput
              value={tags}
              onChange={handleTagsChange}
              onBlur={() => handleBlur("tags")}
              placeholder="Add relevant tags (e.g., production, efficiency, manufacturing)"
              maxTags={5}
            />
            <div className="flex justify-between text-sm text-slate-500">
              <p>Add up to 5 relevant tags to help others find your issue</p>
              <Badge variant="outline">{tags.length}/5</Badge>
            </div>
            {errors.tags && <FieldError message={errors.tags} />}
          </div>

          {/* File Upload Section */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Upload className="h-5 w-5 text-indigo-600" />
              <Label className="text-lg font-semibold text-slate-700">File Attachments</Label>
            </div>
            <FileUpload
              onFilesChange={setUploadedFiles}
              maxFiles={5}
              maxFileSize={10}
              acceptedTypes={["image/*", "application/pdf"]}
            />
            <p className="text-sm text-slate-500">
              Upload supporting documents, screenshots, or reference materials (Images and PDFs only)
            </p>
          </div>

          {/* Validation Alert */}
          {!isFormValid && Object.keys(touched).length > 0 && (
            <Alert className="border-amber-200 bg-amber-50">
              <AlertCircle className="h-4 w-4 text-amber-600" />
              <AlertDescription className="text-amber-700">
                Please fix the errors above before submitting your issue.
              </AlertDescription>
            </Alert>
          )}

          {/* Success Indicator */}
          {isFormValid && Object.keys(touched).length > 0 && (
            <Alert className="border-green-200 bg-green-50">
              <CheckCircle className="h-4 w-4 text-green-600" />
              <AlertDescription className="text-green-700">Great! Your issue is ready to submit.</AlertDescription>
            </Alert>
          )}

          {/* Submit Button */}
          <div className="flex justify-end pt-6">
            <Button
              type="submit"
              disabled={isSubmitting || !isFormValid}
              size="lg"
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-3 text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-200 disabled:opacity-50"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                  Creating Issue...
                </>
              ) : (
                <>
                  <Save className="h-5 w-5 mr-2" />
                  Create Issue
                </>
              )}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}

const FieldError = ({ message }: { message: string }) => (
  <div className="flex items-center gap-2 text-red-600 text-sm mt-1">
    <AlertCircle className="h-4 w-4" />
    {message}
  </div>
)
