"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { ThumbsUp, MessageSquare, Award, ChevronDown, ChevronUp } from "lucide-react"
import type { Solution, Review, Reply } from "@/types/globelTypes"
import { formatDistanceToNow } from "@/lib/utils"
import StarRating from "./star-rating"

interface SolutionItemProps {
  solution: Solution
  isTopSolution?: boolean
}

export default function SolutionItem({ solution, isTopSolution = false }: SolutionItemProps) {
  const [reviews, setReviews] = useState<Review[]>(solution.reviews)
  const [replies, setReplies] = useState<Reply[]>(solution.replies)
  const [isAddingReview, setIsAddingReview] = useState(false)
  const [isAddingReply, setIsAddingReply] = useState(false)
  const [showReviews, setShowReviews] = useState(false)
  const [showReplies, setShowReplies] = useState(true)
  const [reviewRating, setReviewRating] = useState(0)
  const [reviewComment, setReviewComment] = useState("")
  const [replyContent, setReplyContent] = useState("")
  const [votes, setVotes] = useState(solution.votes)

  // Calculate average rating
  const avgRating = reviews.length ? reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length : 0

  const handleAddReview = () => {
    if (reviewRating === 0) return

    const newReview: Review = {
      id: Date.now().toString(),
      author: {
        id: "current-user",
        name: "You",
        avatar: "/placeholder.svg?height=40&width=40",
      },
      rating: reviewRating,
      comment: reviewComment,
      createdAt: new Date().toISOString(),
    }

    setReviews([...reviews, newReview])
    setReviewRating(0)
    setReviewComment("")
    setIsAddingReview(false)
  }

  const handleAddReply = () => {
    if (!replyContent.trim()) return

    const newReply: Reply = {
      id: Date.now().toString(),
      author: {
        id: "current-user",
        name: "You",
        avatar: "/placeholder.svg?height=40&width=40",
      },
      content: replyContent,
      createdAt: new Date().toISOString(),
      votes: 0,
      replies: [],
    }

    setReplies([...replies, newReply])
    setReplyContent("")
    setIsAddingReply(false)
  }

  const handleVote = () => {
    setVotes(votes + 1)
  }

  return (
    <Card className={`relative ${isTopSolution ? "border-2 border-yellow-400 dark:border-yellow-600" : ""}`}>
      {isTopSolution && (
        <div className="absolute -top-3 -right-3 bg-yellow-400 dark:bg-yellow-600 text-black dark:text-white rounded-full p-1.5 shadow-md">
          <Award className="h-4 w-4" />
        </div>
      )}

      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Avatar className="h-8 w-8">
              <AvatarImage src={solution.author.avatar || "/placeholder.svg"} />
              <AvatarFallback>{solution.author.name.charAt(0)}</AvatarFallback>
            </Avatar>
            <div>
              <div className="font-medium">{solution.author.name}</div>
              <div className="text-xs text-muted-foreground">{formatDistanceToNow(solution.createdAt)}</div>
            </div>
          </div>

          {reviews.length > 0 && (
            <div className="flex items-center gap-1">
              <StarRating rating={Math.round(avgRating)} readonly />
              <span className="text-sm text-muted-foreground">({reviews.length})</span>
            </div>
          )}
        </div>
      </CardHeader>

      <CardContent>
        <div className="prose dark:prose-invert max-w-none" dangerouslySetInnerHTML={{ __html: solution.content }} />
      </CardContent>

      <CardFooter className="flex flex-wrap gap-2 border-t p-4">
        <Button variant="outline" size="sm" onClick={handleVote}>
          <ThumbsUp className="mr-1 h-4 w-4" />
          <span>{votes}</span>
        </Button>

        <Button variant="outline" size="sm" onClick={() => setIsAddingReply(!isAddingReply)}>
          <MessageSquare className="mr-1 h-4 w-4" />
          Reply
        </Button>

        <Button variant="outline" size="sm" onClick={() => setIsAddingReview(!isAddingReview)}>
          <StarRating rating={0} className="mr-1" />
          Review
        </Button>

        {reviews.length > 0 && (
          <Button variant="ghost" size="sm" onClick={() => setShowReviews(!showReviews)}>
            {showReviews ? (
              <>
                <ChevronUp className="mr-1 h-4 w-4" />
                Hide Reviews
              </>
            ) : (
              <>
                <ChevronDown className="mr-1 h-4 w-4" />
                Show Reviews ({reviews.length})
              </>
            )}
          </Button>
        )}

        {replies.length > 0 && (
          <Button variant="ghost" size="sm" onClick={() => setShowReplies(!showReplies)} className="ml-auto">
            {showReplies ? (
              <>
                <ChevronUp className="mr-1 h-4 w-4" />
                Hide Replies
              </>
            ) : (
              <>
                <ChevronDown className="mr-1 h-4 w-4" />
                Show Replies ({replies.length})
              </>
            )}
          </Button>
        )}
      </CardFooter>

      <AnimatePresence>
        {isAddingReview && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="border-t p-4 space-y-4 overflow-hidden"
          >
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium">Your Rating:</span>
                <StarRating rating={reviewRating} onRatingChange={setReviewRating} />
              </div>
              <Textarea
                placeholder="Add a comment with your review (optional)"
                value={reviewComment}
                onChange={(e) => setReviewComment(e.target.value)}
                className="min-h-[80px]"
              />
            </div>
            <div className="flex gap-2">
              <Button size="sm" onClick={handleAddReview} disabled={reviewRating === 0}>
                Submit Review
              </Button>
              <Button size="sm" variant="outline" onClick={() => setIsAddingReview(false)}>
                Cancel
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showReviews && reviews.length > 0 && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="border-t p-4 space-y-3 overflow-hidden"
          >
            <h4 className="font-medium">Reviews</h4>
            <div className="space-y-3">
              {reviews.map((review) => (
                <div key={review.id} className="flex items-start gap-3 text-sm">
                  <Avatar className="h-6 w-6">
                    <AvatarImage src={review.author.avatar || "/placeholder.svg"} />
                    <AvatarFallback>{review.author.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-medium">{review.author.name}</span>
                      <StarRating rating={review.rating} readonly size="sm" />
                      <span className="text-xs text-muted-foreground">{formatDistanceToNow(review.createdAt)}</span>
                    </div>
                    {review.comment && <p>{review.comment}</p>}
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isAddingReply && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="border-t p-4 space-y-4 overflow-hidden"
          >
            <Textarea
              placeholder="Write your reply..."
              value={replyContent}
              onChange={(e) => setReplyContent(e.target.value)}
              className="min-h-[100px]"
            />
            <div className="flex gap-2">
              <Button size="sm" onClick={handleAddReply} disabled={!replyContent.trim()}>
                Post Reply
              </Button>
              <Button size="sm" variant="outline" onClick={() => setIsAddingReply(false)}>
                Cancel
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showReplies && replies.length > 0 && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="border-t p-4 space-y-4 overflow-hidden"
          >
            <h4 className="font-medium">Replies</h4>
            <div className="space-y-4 pl-4 border-l-2 border-muted">
              {replies.map((reply) => (
                <ReplyItem key={reply.id} reply={reply} />
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </Card>
  )
}

interface ReplyItemProps {
  reply: Reply
  level?: number
}

function ReplyItem({ reply, level = 0 }: ReplyItemProps) {
  const [showReplies, setShowReplies] = useState(true)
  const [isReplying, setIsReplying] = useState(false)
  const [replyContent, setReplyContent] = useState("")
  const [replies, setReplies] = useState<Reply[]>(reply.replies)
  const [votes, setVotes] = useState(reply.votes)

  const handleAddReply = () => {
    if (!replyContent.trim()) return

    const newReply: Reply = {
      id: Date.now().toString(),
      author: {
        id: "current-user",
        name: "You",
        avatar: "/placeholder.svg?height=40&width=40",
      },
      content: replyContent,
      createdAt: new Date().toISOString(),
      votes: 0,
      replies: [],
    }

    setReplies([...replies, newReply])
    setReplyContent("")
    setIsReplying(false)
  }

  const handleVote = () => {
    setVotes(votes + 1)
  }

  return (
    <div className="space-y-3">
      <div className="flex items-start gap-3">
        <Avatar className="h-6 w-6">
          <AvatarImage src={reply.author.avatar || "/placeholder.svg"} />
          <AvatarFallback>{reply.author.name.charAt(0)}</AvatarFallback>
        </Avatar>

        <div className="space-y-1 flex-1">
          <div className="flex items-center gap-2">
            <span className="font-medium">{reply.author.name}</span>
            <span className="text-xs text-muted-foreground">{formatDistanceToNow(reply.createdAt)}</span>
          </div>
          <p className="text-sm">{reply.content}</p>
          <div className="flex items-center gap-2 pt-1">
            <Button variant="ghost" size="sm" className="h-6 px-2 text-xs" onClick={handleVote}>
              <ThumbsUp className="h-3 w-3 mr-1" />
              <span>{votes}</span>
            </Button>
            <Button variant="ghost" size="sm" className="h-6 px-2 text-xs" onClick={() => setIsReplying(!isReplying)}>
              <MessageSquare className="h-3 w-3 mr-1" />
              Reply
            </Button>

            {replies.length > 0 && (
              <Button
                variant="ghost"
                size="sm"
                className="h-6 px-2 text-xs"
                onClick={() => setShowReplies(!showReplies)}
              >
                {showReplies ? (
                  <>
                    <ChevronUp className="h-3 w-3 mr-1" />
                    Hide Replies
                  </>
                ) : (
                  <>
                    <ChevronDown className="h-3 w-3 mr-1" />
                    Show Replies ({replies.length})
                  </>
                )}
              </Button>
            )}
          </div>
        </div>
      </div>

      <AnimatePresence>
        {isReplying && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="pl-8 space-y-3 overflow-hidden"
          >
            <Textarea
              placeholder="Write your reply..."
              value={replyContent}
              onChange={(e) => setReplyContent(e.target.value)}
              className="min-h-[80px]"
            />
            <div className="flex gap-2">
              <Button size="sm" onClick={handleAddReply} disabled={!replyContent.trim()}>
                Post Reply
              </Button>
              <Button size="sm" variant="outline" onClick={() => setIsReplying(false)}>
                Cancel
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showReplies && replies.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="pl-8 space-y-4 border-l-2 border-muted"
          >
            {replies.map((nestedReply) => (
              <ReplyItem key={nestedReply.id} reply={nestedReply} level={level + 1} />
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
