"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { ThumbsUp, Award, ChevronDown, ChevronUp } from "lucide-react"
import { formatDistanceToNow } from "@/lib/utils"
import StarRating from "./star-rating"

interface SolutionItemProps {
  solution: any
  isTopSolution?: boolean
}

export default function SolutionItemTest({ solution, isTopSolution = false }: SolutionItemProps) {
  const [reviews, setReviews] = useState<any[]>(solution.reviews)
  const [isAddingReview, setIsAddingReview] = useState(false)
  const [showReviews, setShowReviews] = useState(false)
  const [reviewRating, setReviewRating] = useState(0)
  const [reviewComment, setReviewComment] = useState("")
  const [votes, setVotes] = useState(solution.votes)

  const avgRating = reviews.length ? 
    (reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length).toFixed(1) : 
    "0.0"

  const handleAddReview = () => {
    if (reviewRating === 0) return

    const newReview: any = {
      id: Date.now().toString(),
      author: {
        id: "current-user",
        name: "You",
        avatar: "/placeholder.svg"
      },
      rating: reviewRating,
      comment: reviewComment,
      createdAt: new Date().toISOString()
    }

    setReviews([...reviews, newReview])
    setReviewRating(0)
    setReviewComment("")
    setIsAddingReview(false)
  }

  return (
    <Card className={`relative ${isTopSolution ? "border-2 border-yellow-400" : ""}`}>
      {isTopSolution && (
        <div className="absolute -top-3 -right-3 bg-yellow-400 text-black rounded-full p-1.5 shadow-md">
          <Award className="h-4 w-4" />
        </div>
      )}

      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Avatar className="h-8 w-8">
              <AvatarImage src={solution.IMAGE} />
              <AvatarFallback>{solution.FULL_NAME.charAt(0)}</AvatarFallback>
            </Avatar>
            <div>
              <div className="font-medium">{solution.FULL_NAME}</div>
              <div className="text-xs text-muted-foreground">
                {formatDistanceToNow(solution.createdAt)} ago
              </div>
            </div>
          </div>

          <div className="flex items-center gap-1">
            <StarRating rating={Math.round(Number(avgRating))} readonly />
            <span className="text-sm text-muted-foreground">
              {avgRating} ({reviews.length})
            </span>
          </div>
        </div>
      </CardHeader>

      <CardContent>
        <div 
          className="prose max-w-none" 
          dangerouslySetInnerHTML={{ __html: solution.content }} 
        />
      </CardContent>

      <CardFooter className="flex flex-wrap gap-2 border-t p-4">
        <Button variant="outline" size="sm" onClick={() => setVotes(votes + 1)}>
          <ThumbsUp className="mr-1 h-4 w-4" />
          <span>{votes}</span>
        </Button>

        <Button 
          variant="outline" 
          size="sm" 
          onClick={() => setIsAddingReview(!isAddingReview)}
        >
          {/* <StarRating rating={0} className="mr-1" /> */}
          {isAddingReview ? "Cancel Review" : "Add Review"}
        </Button>

        {reviews.length > 0 && (
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => setShowReviews(!showReviews)}
          >
            {showReviews ? (
              <>
                <ChevronUp className="mr-1 h-4 w-4" />
                Hide Reviews
              </>
            ) : (
              <>
                <ChevronDown className="mr-1 h-4 w-4" />
                Show Reviews
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
            className="border-t p-4 space-y-4"
          >
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium">Your Rating:</span>
                <StarRating 
                  rating={reviewRating} 
                  onRatingChange={setReviewRating} 
                />
              </div>
              <Textarea
                placeholder="Add a comment (optional)"
                value={reviewComment}
                onChange={(e) => setReviewComment(e.target.value)}
                className="min-h-[80px]"
              />
            </div>
            <div className="flex gap-2">
              <Button 
                size="sm" 
                onClick={handleAddReview} 
                disabled={reviewRating === 0}
              >
                Submit Review
              </Button>
              <Button 
                size="sm" 
                variant="outline" 
                onClick={() => setIsAddingReview(false)}
              >
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
            className="border-t p-4 space-y-3"
          >
            <h4 className="font-medium">Reviews</h4>
            <div className="space-y-3">
              {reviews.map((review) => (
                <div key={review.id} className="flex items-start gap-3 text-sm">
                  <Avatar className="h-6 w-6">
                    <AvatarImage src={review.author.avatar} />
                    <AvatarFallback>{review.author.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-medium">{review.author.name}</span>
                      <StarRating rating={review.rating} readonly size="sm" />
                      <span className="text-xs text-muted-foreground">
                        {formatDistanceToNow(review.createdAt)} ago
                      </span>
                    </div>
                    {review.comment && <p>{review.comment}</p>}
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </Card>
  )
}