"use client"

import type React from "react"

import { useState, useRef, useCallback } from "react"
import { Upload, X, File, ImageIcon, Loader2, AlertCircle, CheckCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import axios from "axios"
import Link from "next/link"

interface UploadedFile {
  id: string
  name: string
  size: number
  type: string
  url: string
  uploadedAt: Date
}

interface FileUploadProps {
  onFilesChange: (files: UploadedFile[]) => void
  maxFiles?: number
  maxFileSize?: number
  acceptedTypes?: string[]
  className?: string
}

export default function FileUpload({
  onFilesChange,
  maxFiles = 5,
  maxFileSize = 5,
  acceptedTypes = ["image/*", "application/pdf"],
  className = "",
}: FileUploadProps) {
  const [files, setFiles] = useState<UploadedFile[]>([])
  const [uploading, setUploading] = useState<string[]>([])
  const [errors, setErrors] = useState<string[]>([])
  const fileInputRef = useRef<HTMLInputElement>(null)

  const uploadImage = async (imageData: File) => {
    const formData = new FormData()
    formData.append("file", imageData)

    const response = await axios.post("https://192.168.1.253:8080/FileUpload/FileUploads", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    })
    return response.data
  }

  const validateFile = (file: File): string | null => {
    // Check file size
    if (file.size > maxFileSize * 1024 * 1024) {
      return `File size must be less than ${maxFileSize}MB`
    }

    // Check file type
    const isValidType = acceptedTypes.some((type) => {
      if (type.includes("*")) {
        const baseType = type.split("/")[0]
        return file.type.startsWith(baseType)
      }
      return file.type === type
    })

    if (!isValidType) {
      return "File type not supported. Please upload images or PDF files only."
    }

    return null
  }

  const handleFileSelect = useCallback(
    async (selectedFiles: FileList) => {
      const newErrors: string[] = []
      const filesToUpload: File[] = []

      // Validate files
      Array.from(selectedFiles).forEach((file) => {
        if (files.length + filesToUpload.length >= maxFiles) {
          newErrors.push(`Maximum ${maxFiles} files allowed`)
          return
        }

        const error = validateFile(file)
        if (error) {
          newErrors.push(`${file.name}: ${error}`)
        } else {
          filesToUpload.push(file)
        }
      })

      setErrors(newErrors)

      // Upload valid files
      for (const file of filesToUpload) {
        const fileId = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`

        try {
          setUploading((prev) => [...prev, fileId])

          const response = await uploadImage(file)

          const uploadedFile: UploadedFile = {
            id: fileId,
            name: file.name,
            size: file.size,
            type: file.type,
            url: response.url || response.data?.url || response,
            uploadedAt: new Date(),
          }

          setFiles((prev) => {
            const updated = [...prev, uploadedFile]
            onFilesChange(updated)
            return updated
          })
        } catch (error) {
          console.error("Upload failed:", error)
          setErrors((prev) => [...prev, `Failed to upload ${file.name}`])
        } finally {
          setUploading((prev) => prev.filter((id) => id !== fileId))
        }
      }
    },
    [files, maxFiles, onFilesChange],
  )

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault()
      const droppedFiles = e.dataTransfer.files
      if (droppedFiles.length > 0) {
        handleFileSelect(droppedFiles)
      }
    },
    [handleFileSelect],
  )

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
  }, [])

  const removeFile = (fileId: string) => {
    setFiles((prev) => {
      const updated = prev.filter((file) => file.id !== fileId)
      onFilesChange(updated)
      return updated
    })
  }

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return "0 Bytes"
    const k = 1024
    const sizes = ["Bytes", "KB", "MB", "GB"]
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return Number.parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i]
  }

  const getFileIcon = (type: string) => {
    if (type.startsWith("image/")) {
      return <ImageIcon className="h-5 w-5 text-blue-600" />
    }
    return <File className="h-5 w-5 text-red-600" />
  }

  const clearErrors = () => setErrors([])

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Upload Area */}
      <Card
        className="border-2 border-dashed border-slate-300 hover:border-blue-400 transition-colors cursor-pointer"
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onClick={() => fileInputRef.current?.click()}
      >
        <CardContent className="p-8 text-center">
          <div className="flex flex-col items-center gap-4">
            <div className="p-4 bg-blue-50 rounded-full">
              <Upload className="h-8 w-8 text-blue-600" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-slate-700 mb-2">Upload Files</h3>
              <p className="text-slate-500 mb-2">Drag and drop files here, or click to browse</p>
              <p className="text-sm text-slate-400">Supports: Images (JPG, PNG, GIF) and PDF files</p>
              <p className="text-sm text-slate-400">
                Max file size: {maxFileSize}MB • Max files: {maxFiles}
              </p>
            </div>
            <Button type="button" variant="outline" className="mt-2 bg-transparent">
              <Upload className="h-4 w-4 mr-2" />
              Choose Files
            </Button>
          </div>
        </CardContent>
      </Card>

      <input
        ref={fileInputRef}
        type="file"
        multiple
        accept={acceptedTypes.join(",")}
        onChange={(e) => e.target.files && handleFileSelect(e.target.files)}
        className="hidden"
      />

      {/* Error Messages */}
      {errors.length > 0 && (
        <Alert className="border-red-200 bg-red-50">
          <AlertCircle className="h-4 w-4 text-red-600" />
          <AlertDescription className="text-red-700">
            <div className="space-y-1">
              {errors.map((error, index) => (
                <div key={index}>{error}</div>
              ))}
            </div>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={clearErrors}
              className="mt-2 h-6 px-2 text-red-600 hover:text-red-700"
            >
              Dismiss
            </Button>
          </AlertDescription>
        </Alert>
      )}

      {/* Uploaded Files List */}
      {files.length > 0 && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="text-sm font-semibold text-slate-700">
              Uploaded Files ({files.length}/{maxFiles})
            </h4>
            <Badge variant="outline" className="text-xs">
              {files.reduce((total, file) => total + file.size, 0) > 0 &&
                formatFileSize(files.reduce((total, file) => total + file.size, 0))}
            </Badge>
          </div>

          <div className="grid gap-3">
            {files.map((file) => (
              <Card key={file.id} className="border border-slate-200">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3 flex-1 min-w-0">
                      {getFileIcon(file.type)}
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-slate-700 truncate">{file.name}</p>
                        <div className="flex items-center gap-2 text-xs text-slate-500">
                          <span>{formatFileSize(file.size)}</span>
                          <span>•</span>
                          <span>{file.uploadedAt.toLocaleTimeString()}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <Badge variant="secondary" className="text-xs">
                        <CheckCircle className="h-3 w-3 mr-1 text-green-600" />
                        Uploaded
                      </Badge>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => removeFile(file.id)}
                        className="h-8 w-8 p-0 text-slate-400 hover:text-red-600"
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>

                  {/* Preview for images */}
                  {file?.type?.startsWith("image/") ? (
                    <div className="mt-3">
                      <Link
                        href={`https://192.168.1.253:8080/uploads/${file.url}`}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <img
                          src={`https://192.168.1.253:8080/uploads/${file.url}`}
                          alt={file.name}
                          className="max-w-full h-20 object-cover rounded border"
                        />
                      </Link>
                    </div>
                  ) : (
                    <div className="mt-3">
                      <Link
                        href={`https://192.168.1.253:8080/uploads/${file.url}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 underline"
                      >
                        📄 {file.name || "Download file"}
                      </Link>
                    </div>
                  )}

                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Currently Uploading */}
      {uploading.length > 0 && (
        <div className="space-y-2">
          <h4 className="text-sm font-semibold text-slate-700">Uploading...</h4>
          {uploading.map((fileId) => (
            <Card key={fileId} className="border border-blue-200 bg-blue-50">
              <CardContent className="p-3">
                <div className="flex items-center gap-3">
                  <Loader2 className="h-4 w-4 animate-spin text-blue-600" />
                  <span className="text-sm text-blue-700">Uploading file...</span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Upload Summary */}
      {files.length > 0 && (
        <div className="bg-slate-50 border border-slate-200 rounded-lg p-4">
          <div className="flex items-center justify-between text-sm">
            <span className="text-slate-600">
              {files.length} file{files.length !== 1 ? "s" : ""} ready to submit
            </span>
            <span className="text-slate-500">
              Total size: {formatFileSize(files.reduce((total, file) => total + file.size, 0))}
            </span>
          </div>
        </div>
      )}
    </div>
  )
}
