"use client"

import { useState } from "react"
import Link from "next/link"
import { motion, AnimatePresence } from "framer-motion"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { ThumbsUp, ThumbsDown, MessageSquare, ArrowLeft } from "lucide-react"
import type { Issue, Solution } from "@/types/globelTypes"
import { formatDistanceToNow } from "@/lib/utils"
import CreateSolutionForm from "./create-solution-form"
import SolutionItem from "./solution-item"

interface IssueDetailProps {
  issue: Issue
}

export default function IssueDetail({ issue }: IssueDetailProps) {
  const [solutions, setSolutions] = useState<Solution[]>(issue.solutions)
  const [isAddingSolution, setIsAddingSolution] = useState(false)
  const [votes, setVotes] = useState(issue.votes)
  const [hasVoted, setHasVoted] = useState<boolean | null>(null)

  // Sort solutions by rating (highest first)
  const sortedSolutions = [...solutions].sort((a, b) => {
    // Calculate average rating
    const avgRatingA = a.reviews.length ? a.reviews.reduce((sum, r) => sum + r.rating, 0) / a.reviews.length : 0
    const avgRatingB = b.reviews.length ? b.reviews.reduce((sum, r) => sum + r.rating, 0) / b.reviews.length : 0

    // Sort by average rating, then by number of reviews
    return avgRatingB - avgRatingA || b.reviews.length - a.reviews.length
  })

  const handleAddSolution = (newSolution: Solution) => {
    setSolutions([...solutions, newSolution])
    setIsAddingSolution(false)
  }

  const handleVote = (type: "up" | "down") => {
    if (hasVoted === (type === "up")) {
      // Undo vote
      setVotes(votes + (type === "up" ? -1 : 1))
      setHasVoted(null)
    } else {
      // Change vote or new vote
      const voteChange = hasVoted === null ? 1 : 2
      setVotes(votes + (type === "up" ? voteChange : -voteChange))
      setHasVoted(type === "up")
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <Link href="/" className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground mb-4">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to all issues
        </Link>

        <div className="flex flex-wrap gap-2 mb-2">
          {issue.tags.map((tag) => (
            <Badge key={tag} variant="secondary">
              {tag}
            </Badge>
          ))}
        </div>

        <h1 className="text-3xl font-bold mb-2">{issue.title}</h1>

        <div className="flex items-center gap-2 text-sm text-muted-foreground mb-6">
          <Avatar className="h-6 w-6">
            <AvatarImage src={issue.author.avatar || "/placeholder.svg"} />
            <AvatarFallback>{issue.author.name.charAt(0)}</AvatarFallback>
          </Avatar>
          <span>{issue.author.name}</span>
          <span>•</span>
          <span>{formatDistanceToNow(issue.createdAt)}</span>
        </div>
      </div>

      <Card>
        <CardContent className="pt-6">
          <div className="prose dark:prose-invert max-w-none" dangerouslySetInnerHTML={{ __html: issue.content }} />
        </CardContent>
        <CardFooter className="flex justify-between border-t p-4">
          <div className="flex items-center gap-4">
            <Button variant={hasVoted === true ? "default" : "outline"} size="sm" onClick={() => handleVote("up")}>
              <ThumbsUp className="mr-1 h-4 w-4" />
              <span>{votes}</span>
            </Button>
            <Button variant={hasVoted === false ? "default" : "outline"} size="sm" onClick={() => handleVote("down")}>
              <ThumbsDown className="h-4 w-4" />
            </Button>
          </div>
          <div className="flex items-center gap-1">
            <MessageSquare className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm text-muted-foreground">{solutions.length} solutions</span>
          </div>
        </CardFooter>
      </Card>

      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold">{solutions.length} Solutions</h2>
          {!isAddingSolution && <Button onClick={() => setIsAddingSolution(true)}>Add Solution</Button>}
        </div>

        <AnimatePresence>
          {isAddingSolution && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
            >
              <Card className="mb-6">
                <CardHeader>
                  <h3 className="text-lg font-semibold">Your Solution</h3>
                </CardHeader>
                <CardContent>
                  <CreateSolutionForm onSubmit={handleAddSolution} onCancel={() => setIsAddingSolution(false)} />
                </CardContent>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>

        {sortedSolutions.length > 0 ? (
          <div className="space-y-6">
            {sortedSolutions.map((solution, index) => (
              <SolutionItem
                key={solution.id}
                solution={solution}
                isTopSolution={index === 0 && solution.reviews.length > 0}
              />
            ))}
          </div>
        ) : (
          <Card className="bg-muted/50">
            <CardContent className="py-8 text-center">
              <p className="text-muted-foreground">No solutions yet. Be the first to add one!</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
