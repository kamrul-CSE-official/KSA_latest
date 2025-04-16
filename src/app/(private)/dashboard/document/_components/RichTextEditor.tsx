"use client"

import { memo, useCallback, useEffect, useRef, useState } from "react"
import { useEditor, EditorContent } from "@tiptap/react"
import StarterKit from "@tiptap/starter-kit"
import Image from "@tiptap/extension-image"
import Table from "@tiptap/extension-table"
import TableRow from "@tiptap/extension-table-row"
import TableCell from "@tiptap/extension-table-cell"
import TableHeader from "@tiptap/extension-table-header"
import Mention from "@tiptap/extension-mention"
import Placeholder from "@tiptap/extension-placeholder"
import { toast } from "sonner"
import axios from "axios"
import { imageBaseUrl } from "@/config/envConfig"
import { useIdeaContentUpdateMutation } from "@/redux/services/ideaApi"
import { useSearchParams } from "next/navigation"
import debounce from "lodash.debounce"

import { Check, Loader2, Save, Bold, Italic, List, ListOrdered, Quote, Code, ImageIcon, TableIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import "./mention/mention.css"

interface RichTextEditorProps {
  initialData?: any
  onSave?: (data: any) => void
}

// Helper function to convert EditorJS data to TipTap JSON
const convertEditorJSToTipTap = (editorJSData: any) => {
  if (!editorJSData || !editorJSData.blocks) {
    return {
      type: "doc",
      content: [
        {
          type: "paragraph",
          content: [{ type: "text", text: "" }],
        },
      ],
    }
  }

  const content: any[] = []

  editorJSData.blocks.forEach((block: any) => {
    switch (block.type) {
      case "header":
        content.push({
          type: "heading",
          attrs: { level: block.data.level },
          content: [{ type: "text", text: block.data.text }],
        })
        break
      case "paragraph":
        content.push({
          type: "paragraph",
          content: [{ type: "text", text: block.data.text }],
        })
        break
      case "list":
        content.push({
          type: block.data.style === "ordered" ? "orderedList" : "bulletList",
          content: block.data.items.map((item: string) => ({
            type: "listItem",
            content: [
              {
                type: "paragraph",
                content: [{ type: "text", text: item }],
              },
            ],
          })),
        })
        break
      case "image":
        content.push({
          type: "image",
          attrs: {
            src: block.data.file?.url || block.data.url,
            alt: block.data.caption || "",
          },
        })
        break
      case "quote":
        content.push({
          type: "blockquote",
          content: [
            {
              type: "paragraph",
              content: [{ type: "text", text: block.data.text }],
            },
          ],
        })
        break
      case "code":
        content.push({
          type: "codeBlock",
          attrs: { language: block.data.language || "javascript" },
          content: [{ type: "text", text: block.data.code }],
        })
        break
      case "table":
        const rows = []
        for (let i = 0; i < block.data.content.length; i++) {
          const cells = []
          for (let j = 0; j < block.data.content[i].length; j++) {
            cells.push({
              type: i === 0 && block.data.withHeadings ? "tableHeader" : "tableCell",
              content: [
                {
                  type: "paragraph",
                  content: [{ type: "text", text: block.data.content[i][j] }],
                },
              ],
            })
          }
          rows.push({
            type: "tableRow",
            content: cells,
          })
        }
        content.push({
          type: "table",
          content: rows,
        })
        break
      default:
        // For unsupported blocks, convert to paragraph
        content.push({
          type: "paragraph",
          content: [{ type: "text", text: JSON.stringify(block.data) }],
        })
    }
  })

  return {
    type: "doc",
    content,
  }
}

// Helper function to convert TipTap JSON to EditorJS format
const convertTipTapToEditorJS = (tiptapJSON: any) => {
  if (!tiptapJSON || !tiptapJSON.content) {
    return {
      time: Date.now(),
      blocks: [],
    }
  }

  const blocks: any[] = []

  const processNode = (node: any) => {
    switch (node.type) {
      case "heading":
        blocks.push({
          type: "header",
          data: {
            text: node.content?.[0]?.text || "",
            level: node.attrs?.level || 2,
          },
        })
        break
      case "paragraph":
        blocks.push({
          type: "paragraph",
          data: {
            text: node.content?.map((c: any) => c.text || "").join("") || "",
          },
        })
        break
      case "bulletList":
        const bulletItems = node.content?.map((item: any) => item.content?.[0]?.content?.[0]?.text || "") || []
        blocks.push({
          type: "list",
          data: {
            style: "unordered",
            items: bulletItems,
          },
        })
        break
      case "orderedList":
        const orderedItems = node.content?.map((item: any) => item.content?.[0]?.content?.[0]?.text || "") || []
        blocks.push({
          type: "list",
          data: {
            style: "ordered",
            items: orderedItems,
          },
        })
        break
      case "image":
        blocks.push({
          type: "image",
          data: {
            url: node.attrs?.src || "",
            caption: node.attrs?.alt || "",
            withBorder: false,
            withBackground: false,
            stretched: false,
          },
        })
        break
      case "blockquote":
        blocks.push({
          type: "quote",
          data: {
            text: node.content?.[0]?.content?.[0]?.text || "",
            caption: "",
            alignment: "left",
          },
        })
        break
      case "codeBlock":
        blocks.push({
          type: "code",
          data: {
            code: node.content?.[0]?.text || "",
            language: node.attrs?.language || "javascript",
          },
        })
        break
      case "table":
        const tableContent: string[][] = []
        node.content?.forEach((row: any) => {
          const rowContent: string[] = []
          row.content?.forEach((cell: any) => {
            rowContent.push(cell.content?.[0]?.content?.[0]?.text || "")
          })
          tableContent.push(rowContent)
        })
        blocks.push({
          type: "table",
          data: {
            withHeadings: false,
            content: tableContent,
          },
        })
        break
      default:
        // Process children for container nodes
        if (node.content) {
          node.content.forEach(processNode)
        }
    }
  }

  tiptapJSON.content.forEach(processNode)

  return {
    time: Date.now(),
    blocks,
  }
}

function RichTextEditor({ initialData, onSave }: RichTextEditorProps) {
  const [saveStatus, setSaveStatus] = useState<"idle" | "saving" | "saved" | "error">("idle")
  const initialDataRef = useRef(initialData)
  const contentRef = useRef<any>(null)
  const saveTimerRef = useRef<NodeJS.Timeout | null>(null)

  const searchParams = useSearchParams()
  const workspaceId = searchParams.get("workspaceId")
  const ideaId = searchParams.get("ideaId")

  const [ideaContentUpdateReq] = useIdeaContentUpdateMutation()

  // Create a stable debounced save function
  const debouncedSave = useRef(
    debounce(async (content: any) => {
      if (!workspaceId || !ideaId) return

      try {
        setSaveStatus("saving")

        // Convert TipTap JSON to EditorJS format
        const editorJSData = convertTipTapToEditorJS(content)

        await ideaContentUpdateReq({
          WorkSpaceID: Number(workspaceId),
          IdeaID: Number(ideaId),
          Content: JSON.stringify(editorJSData),
        })

        if (onSave) {
          onSave(editorJSData)
        }

        setSaveStatus("saved")

        // Clear previous timer if exists
        if (saveTimerRef.current) {
          clearTimeout(saveTimerRef.current)
        }

        // Set timer to reset status
        saveTimerRef.current = setTimeout(() => {
          setSaveStatus("idle")
          saveTimerRef.current = null
        }, 2000)
      } catch (err) {
        console.error("Error saving document:", err)
        setSaveStatus("error")
        toast.error("Failed to save changes", {
          description: "Your changes will be saved when connection is restored",
          duration: 3000,
        })
      }
    }, 2000),
  ).current

  // Convert EditorJS data to TipTap format only once
  const tiptapInitialData = useRef(
    initialDataRef.current ? convertEditorJSToTipTap(initialDataRef.current) : null,
  ).current

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: {
          levels: [1, 2, 3, 4, 5, 6],
        },
      }),
      Image.configure({
        inline: false,
        allowBase64: true,
      }),
      Table.configure({
        resizable: true,
      }),
      TableRow,
      TableHeader,
      TableCell,
      Mention.configure({
        suggestion: {
          items: ({ query }) => {
            return ["John Doe", "Jane Smith", "Ahmed Khan", "Sarah Johnson", "Michael Brown"]
              .filter((item) => item.toLowerCase().startsWith(query.toLowerCase()))
              .slice(0, 5)
          },
        },
      }),
      Placeholder.configure({
        placeholder: "Write your ideas here...",
      }),
    ],
    content: tiptapInitialData,
    autofocus: "end",
    onUpdate: ({ editor }) => {
      // Store the content in ref to avoid re-renders
      contentRef.current = editor.getJSON()
      // Trigger debounced save
      debouncedSave(contentRef.current)
    },
  })

  // Clean up on unmount
  useEffect(() => {
    return () => {
      debouncedSave.cancel()
      if (saveTimerRef.current) {
        clearTimeout(saveTimerRef.current)
      }
      if (editor) {
        editor.destroy()
      }
    }
  }, [debouncedSave, editor])

  // Prevent re-initialization when props change
  useEffect(() => {
    // Only update if initialData has actually changed and is different from what we have
    if (initialData && JSON.stringify(initialData) !== JSON.stringify(initialDataRef.current) && editor) {
      initialDataRef.current = initialData
      const newContent = convertEditorJSToTipTap(initialData)
      editor.commands.setContent(newContent, false)
    }
  }, [initialData, editor])

  const uploadImage = useCallback(
    async (file: File) => {
      if (!editor) return

      try {
        const formData = new FormData()
        formData.append("file", file)
        const response = await axios.post(`${imageBaseUrl()}/FileUpload/ImageUpload`, formData, {
          headers: { "Content-Type": "multipart/form-data" },
        })

        if (response.data) {
          const url = `${imageBaseUrl()}/images/${response.data}`
          editor.chain().focus().setImage({ src: url }).run()
        }
      } catch (error) {
        console.error("Image upload error:", error)
        toast.error("Failed to upload image")
      }
    },
    [editor],
  )

  const handleImageUpload = useCallback(() => {
    const input = document.createElement("input")
    input.type = "file"
    input.accept = "image/*"
    input.onchange = async (event) => {
      const file = (event.target as HTMLInputElement).files?.[0]
      if (file) {
        await uploadImage(file)
      }
    }
    input.click()
  }, [uploadImage])

  if (!editor) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <span className="ml-2 text-sm text-muted-foreground">Loading editor...</span>
      </div>
    )
  }

  return (
    <div className="relative rounded-md overflow-x-hidden border border-border">
      <div className="sticky top-0 z-10 flex items-center gap-1 p-2 bg-background border-b border-border overflow-x-auto">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => editor.chain().focus().toggleBold().run()}
          className={editor.isActive("bold") ? "bg-muted" : ""}
          type="button"
        >
          <Bold className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => editor.chain().focus().toggleItalic().run()}
          className={editor.isActive("italic") ? "bg-muted" : ""}
          type="button"
        >
          <Italic className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          className={editor.isActive("bulletList") ? "bg-muted" : ""}
          type="button"
        >
          <List className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          className={editor.isActive("orderedList") ? "bg-muted" : ""}
          type="button"
        >
          <ListOrdered className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
          className={editor.isActive("blockquote") ? "bg-muted" : ""}
          type="button"
        >
          <Quote className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => editor.chain().focus().toggleCodeBlock().run()}
          className={editor.isActive("codeBlock") ? "bg-muted" : ""}
          type="button"
        >
          <Code className="h-4 w-4" />
        </Button>
        <Button variant="ghost" size="sm" onClick={handleImageUpload} type="button">
          <ImageIcon className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => editor.chain().focus().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run()}
          type="button"
        >
          <TableIcon className="h-4 w-4" />
        </Button>

        <div className="ml-auto flex items-center gap-2 px-3 py-1 rounded-full bg-background/80 backdrop-blur-sm text-sm overflow-x-hidden shadow-sm">
          {saveStatus === "saving" && (
            <>
              <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
              <span className="text-muted-foreground">Saving...</span>
            </>
          )}
          {saveStatus === "saved" && (
            <>
              <Check className="h-4 w-4 text-green-500" />
              <span className="text-green-500">Saved</span>
            </>
          )}
          {saveStatus === "error" && (
            <>
              <Save className="h-4 w-4 text-red-500" />
              <span className="text-red-500">Retry saving...</span>
            </>
          )}
        </div>
      </div>

      <EditorContent editor={editor} className="p-4 min-h-[300px] prose prose-sm max-w-none focus:outline-none" />
    </div>
  )
}

export default memo(RichTextEditor, (prevProps, nextProps) => {
  // Only re-render if initialData has changed significantly
  return prevProps.initialData?.time === nextProps.initialData?.time
})
