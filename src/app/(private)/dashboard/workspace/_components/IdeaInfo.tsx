"use client"

import { useEffect, useState } from "react"
import { format } from "date-fns"
import { useSearchParams } from "next/navigation"
import Link from "next/link"
import { motion } from "framer-motion"

import { useDeleteAIdeaMutation, useIdeaInfoMutation } from "@/redux/services/ideaApi"

import { Card, CardContent } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Skeleton } from "@/components/ui/skeleton"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { toast } from "sonner"

import { BookOpen, Building2, Calendar, FileText, MoreHorizontal, Trash2, Users } from "lucide-react"
import { decrypt, encrypt } from "@/service/encryption"

interface IIdea {
  Title: string
  EnterdOn: string
  EntImg: string
  EntName: string
  EntSec: string
  EntDep: string
  IdeaID: number
}

function IdeaInfo({
  IdeaID,
  setDocCreate,
  docCreate,
  onUpdate, // New prop to notify parent of updates
}: {
  IdeaID: string
  docCreate: boolean
  setDocCreate: (value: boolean) => void
  onUpdate: () => void // New prop type
}) {
  const [ideaInfo, setIdeaInfo] = useState<IIdea[] | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)
  const [refreshKey, setRefreshKey] = useState(0)

  const [fetchIdeaInfo, { isLoading }] = useIdeaInfoMutation()
  const [deleteIdea] = useDeleteAIdeaMutation()

  const searchParams = useSearchParams()
  const workspaceId = searchParams.get("workspaceId")

  // Fetch idea information
  useEffect(() => {
    const getIdeaInfo = async () => {
      try {
        const response = await fetchIdeaInfo({
          Status: 0,
          IdeaID: IdeaID,
        })

        if (response.data) {
          setIdeaInfo(response.data)
        }
      } catch (error) {
        console.error("Failed to fetch idea info:", error)
      }
    }

    getIdeaInfo()
  }, [IdeaID, fetchIdeaInfo, refreshKey])

  const handleDelete = async (ideaId: number) => {
    if (!workspaceId) return

    setIsDeleting(true)

    try {
      // Optimistic update
      setIdeaInfo((prevInfo) => (prevInfo ? prevInfo.filter((idea) => idea.IdeaID !== ideaId) : null))

      await deleteIdea({
        IdeaID: ideaId,
        WorkSpaceID: Number(decrypt(workspaceId)),
      })

      toast.success("Document deleted successfully")
      setDocCreate(false)
      onUpdate() // Notify parent component of the update
    } catch (error) {
      // Revert optimistic update on error
      setRefreshKey((prev) => prev + 1)
      toast.error("Failed to delete document")
      console.error("Delete error:", error)
    } finally {
      setIsDeleting(false)
    }
  }

  if (isLoading && !ideaInfo) {
    return (
      <Card className="overflow-hidden border border-muted/30">
        <CardContent className="p-0">
          <div className="p-4 flex items-center gap-4">
            <Skeleton className="h-10 w-10 rounded-full" />
            <div className="space-y-2 flex-1">
              <Skeleton className="h-5 w-3/4" />
              <div className="flex gap-4">
                <Skeleton className="h-4 w-20" />
                <Skeleton className="h-4 w-20" />
              </div>
            </div>
            <Skeleton className="h-9 w-24 rounded-md" />
          </div>
        </CardContent>
      </Card>
    )
  }

  if (!ideaInfo || ideaInfo.length === 0) {
    return (
      <Card className="overflow-hidden border border-muted/30">
        <CardContent className="p-4 text-center">
          <p className="text-muted-foreground">Document information not available</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <div key={refreshKey}>
      {ideaInfo?.map((idea: IIdea, i: number) => (
        <motion.div key={i} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3 }}>
          <Card className="overflow-hidden hover:shadow-md transition-all border-muted/40 group">
            <CardContent className="p-0">
              <div className="p-4 flex flex-col sm:flex-row sm:items-center gap-4">
                {/* Document Icon and Title */}
                <div className="flex items-center gap-3 min-w-[220px]">
                  <div className="bg-primary/10 p-2.5 rounded-full">
                    <FileText className="h-5 w-5 text-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-medium line-clamp-1 group-hover:text-primary transition-colors">
                      {idea?.Title}
                    </h3>
                    <div className="flex items-center text-xs text-muted-foreground gap-1.5 mt-1">
                      <Calendar className="h-3 w-3" />
                      <span>{format(new Date(idea?.EnterdOn), "MMM d, yyyy")}</span>
                    </div>
                  </div>
                </div>

                {/* Creator and Department Info */}
                <div className="flex flex-1 flex-wrap gap-x-6 gap-y-2 text-sm">
                  <div className="flex items-center gap-2">
                    <Avatar className="h-6 w-6 border border-muted">
                      <AvatarImage
                        src={idea?.EntImg ? `data:image/jpeg;base64,${idea?.EntImg}` : undefined}
                        alt={idea?.EntName}
                      />
                      <AvatarFallback>{idea?.EntName?.charAt(0) || "U"}</AvatarFallback>
                    </Avatar>
                    <span className="text-sm">{idea?.EntName}</span>
                  </div>

                  <div className="flex items-center gap-1.5 text-muted-foreground text-xs">
                    <Users className="h-3 w-3" />
                    <span>{idea?.EntSec}</span>
                  </div>

                  <div className="flex items-center gap-1.5 text-muted-foreground text-xs">
                    <Building2 className="h-3 w-3" />
                    <span>{idea?.EntDep}</span>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex items-center gap-2 ml-auto">
                  <Link href={`/dashboard/document?ideaId=${encrypt(idea?.IdeaID)}&workspaceId=${workspaceId}`}>
                    <Button size="sm" className="flex items-center gap-1.5" variant="outline">
                      <BookOpen className="h-4 w-4" />
                      Open
                    </Button>
                  </Link>

                  <AlertDialog>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button size="sm" variant="ghost" className="h-9 w-9 p-0">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Document Options</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <Link href={`/dashboard/document?ideaId=${encrypt(idea?.IdeaID)}&workspaceId=${workspaceId}`}>
                          <DropdownMenuItem>
                            <BookOpen className="h-4 w-4 mr-2" />
                            Open Document
                          </DropdownMenuItem>
                        </Link>
                        <AlertDialogTrigger asChild>
                          <DropdownMenuItem className="text-destructive focus:text-destructive">
                            <Trash2 className="h-4 w-4 mr-2" />
                            Delete Document 
                          </DropdownMenuItem>
                        </AlertDialogTrigger>
                      </DropdownMenuContent>
                    </DropdownMenu>

                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                        <AlertDialogDescription>
                          This will permanently delete the document "{idea?.Title}". This action cannot be undone.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                          onClick={() => handleDelete(idea?.IdeaID)}
                          className="bg-destructive hover:bg-destructive/90 text-white"
                          disabled={isDeleting}
                        >
                          {isDeleting ? "Deleting..." : "Delete"}
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      ))}
    </div>
  )
}

export default IdeaInfo

