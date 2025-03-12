"use client"

import { memo, type ReactNode, useEffect, useState, useRef } from "react"
import { format } from "date-fns"
import { useSearchParams } from "next/navigation"
import { useSelector } from "react-redux"
import { toast } from "sonner"

import type { RootState } from "@/redux/store"
import { useCommentSendMutation } from "@/redux/services/ideaApi"

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Loader2, MessageCircle, Send, Clock, User } from "lucide-react"

function Comment({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false)
  const [comment, setComment] = useState("")
  const scrollPositionRef = useRef(0)

  const searchParams = useSearchParams()
  const ideaId = searchParams.get("ideaId")

  const [commentSend, { isLoading, data: comments, error }] = useCommentSendMutation()
  const { userData } = useSelector((state: RootState) => state.user)

  // Fetch comments when the component mounts or ideaId changes
  useEffect(() => {
    if (ideaId) {
      commentSend({
        Type: 2, // Fetch existing comments
        IdeaID: Number(ideaId),
      })
    }
  }, [ideaId, commentSend])

  // Save scroll position when dialog opens
  useEffect(() => {
    if (open) {
      scrollPositionRef.current = window.scrollY
    }
  }, [open])

  const handleOpenChange = (newOpen: boolean) => {
    setOpen(newOpen)

    // If closing the dialog, restore scroll position after a short delay
    if (!newOpen) {
      setTimeout(() => {
        window.scrollTo({
          top: scrollPositionRef.current,
          behavior: "instant" as ScrollBehavior,
        })
      }, 10)
    }
  }

  const handleCommentSubmit = async () => {
    if (!comment.trim()) {
      toast.error("Comment cannot be empty")
      return
    }

    try {
      await commentSend({
        Type: 1, // Type 1 for sending a new comment
        EmpID: userData?.EmpID,
        CommentText: comment.trim(),
        IdeaID: Number(ideaId),
      })

      toast.success("Comment submitted successfully")
      setComment("") // Clear comment input

      // Refresh comments
      await commentSend({
        Type: 2,
        IdeaID: Number(ideaId),
      })
    } catch (err) {
      toast.error("Failed to submit comment")
      console.error("Comment submission error:", err)
    }
  }

  if (error) {
    toast.error("Failed to load comments")
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-md md:max-w-2xl lg:max-w-4xl p-0 overflow-hidden">
        <div className="flex h-[80vh] md:h-[70vh] flex-col md:flex-row">
          {/* Comments List Section */}
          <div className="w-full md:w-2/3 p-6 border-r border-border overflow-hidden flex flex-col">
            <DialogHeader className="mb-4">
              <div className="flex items-center justify-between">
                <DialogTitle className="text-xl font-semibold flex items-center gap-2">
                  <MessageCircle className="h-5 w-5 text-primary" />
                  Comments
                </DialogTitle>
                <Badge variant="outline" className="px-2 py-1">
                  {comments ? comments.length : 0} comments
                </Badge>
              </div>
            </DialogHeader>

            <Tabs defaultValue="all" className="mb-4">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="all">All Comments</TabsTrigger>
                <TabsTrigger value="recent">Recent</TabsTrigger>
              </TabsList>

              <TabsContent value="all" className="mt-2">
                <ScrollArea className="max-h-[60vh] overflow-y-auto pr-4">
                  {isLoading ? (
                    <div className="flex justify-center items-center h-40">
                      <Loader2 className="h-8 w-8 animate-spin text-primary" />
                    </div>
                  ) : comments && comments.length > 0 ? (
                    <div className="space-y-4">
                      {comments.map((comm: any, i: number) => (
                        <div key={i} className="group">
                          <div className="p-4 rounded-lg bg-muted/40 hover:bg-muted/60 transition-colors">
                            <div className="flex items-center gap-3">
                              <Avatar className="border border-primary/10">
                                <AvatarImage src={`data:image/jpeg;base64,${comm?.Img}`} alt={comm?.Name || "User"} />
                                <AvatarFallback>{comm?.Name?.substring(0, 2) || "NA"}</AvatarFallback>
                              </Avatar>
                              <div className="flex flex-col">
                                <h2 className="font-medium text-sm">{comm?.Name}</h2>
                                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                  <span>{comm?.Section}</span>
                                  <span>•</span>
                                  <span className="flex items-center gap-1">
                                    <Clock className="h-3 w-3" />
                                    {format(new Date(comm?.CreatedAt), "MMM do, yyyy")}
                                  </span>
                                </div>
                              </div>
                            </div>
                            <p className="mt-3 text-sm leading-relaxed">{comm?.CommentText}</p>
                          </div>
                          {i < comments.length - 1 && <Separator className="my-4" />}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center h-40 text-muted-foreground">
                      <MessageCircle className="h-10 w-10 mb-2 opacity-20" />
                      <p>No comments yet</p>
                      <p className="text-sm">Be the first to share your thoughts!</p>
                    </div>
                  )}
                </ScrollArea>
              </TabsContent>

              <TabsContent value="recent" className="mt-2">
                <ScrollArea className="max-h-[60vh] overflow-y-auto pr-4">
                  {isLoading ? (
                    <div className="flex justify-center items-center h-40">
                      <Loader2 className="h-8 w-8 animate-spin text-primary" />
                    </div>
                  ) : comments && comments.length > 0 ? (
                    <div className="space-y-4">
                      {[...comments]
                        .sort((a: any, b: any) => new Date(b.CreatedAt).getTime() - new Date(a.CreatedAt).getTime())
                        .slice(0, 5)
                        .map((comm: any, i: number) => (
                          <div key={i} className="group">
                            <div className="p-4 rounded-lg bg-muted/40 hover:bg-muted/60 transition-colors">
                              <div className="flex items-center gap-3">
                                <Avatar className="border border-primary/10">
                                  <AvatarImage src={`data:image/jpeg;base64,${comm?.Img}`} alt={comm?.Name || "User"} />
                                  <AvatarFallback>{comm?.Name?.substring(0, 2) || "NA"}</AvatarFallback>
                                </Avatar>
                                <div className="flex flex-col">
                                  <h2 className="font-medium text-sm">{comm?.Name}</h2>
                                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                    <span>{comm?.Section}</span>
                                    <span>•</span>
                                    <span className="flex items-center gap-1">
                                      <Clock className="h-3 w-3" />
                                      {format(new Date(comm?.CreatedAt), "MMM do, yyyy")}
                                    </span>
                                  </div>
                                </div>
                              </div>
                              <p className="mt-3 text-sm leading-relaxed">{comm?.CommentText}</p>
                            </div>
                            {i < Math.min(comments.length, 5) - 1 && <Separator className="my-4" />}
                          </div>
                        ))}
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center h-40 text-muted-foreground">
                      <MessageCircle className="h-10 w-10 mb-2 opacity-20" />
                      <p>No comments yet</p>
                      <p className="text-sm">Be the first to share your thoughts!</p>
                    </div>
                  )}
                </ScrollArea>
              </TabsContent>
            </Tabs>
          </div>

          {/* Comment Form Section */}
          <div className="w-full md:w-1/3 p-6 bg-muted/30 flex flex-col">
            <div className="mb-4">
              <h3 className="text-lg font-medium mb-1">Add a comment</h3>
              <p className="text-sm text-muted-foreground">Share your thoughts or feedback on this document</p>
            </div>

            <div className="flex items-center gap-3 mb-4">
              <Avatar className="h-8 w-8">
                <AvatarImage
                  src={userData?.Image ? `data:image/jpeg;base64,${userData.Image}` : undefined}
                  alt={userData?.FullName || "User"}
                />
                <AvatarFallback>
                  <User className="h-4 w-4" />
                </AvatarFallback>
              </Avatar>
              <div className="text-sm">
                <div className="font-medium">{userData?.FullName || "You"}</div>
                <div className="text-xs text-muted-foreground">{userData?.SectionName || userData?.SubCostCenter}</div>
              </div>
            </div>

            <Textarea
              placeholder="Write your comment here..."
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              className="flex-1 min-h-[150px] resize-none mb-4"
            />

            <div className="flex justify-end gap-3 mt-auto">
              <Button variant="outline" onClick={() => setOpen(false)} className="px-4">
                Cancel
              </Button>
              <Button onClick={handleCommentSubmit} disabled={isLoading || !comment.trim()} className="px-4">
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Submitting...
                  </>
                ) : (
                  <>
                    <Send className="mr-2 h-4 w-4" />
                    Submit
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default memo(Comment)

