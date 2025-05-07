"use client";

import { useState, useMemo, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { ThumbsUp, ThumbsDown, MessageSquare, ArrowLeft } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import type { IIssue, Solution } from "@/types/globelTypes";
import { formatDistanceToNow } from "@/lib/utils";
import CreateSolutionForm from "./create-solution-form";
import SolutionItem from "./solution-item";
import { useIssuesLikesMutation } from "@/redux/services/issuesApi";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";

interface IssueDetailProps {
  issue: [IIssue];
}

export default function IssueDetail({ issue }: IssueDetailProps) {
  const currentIssue = issue[0];
  const [solutions, setSolutions] = useState<Solution[]>(
    currentIssue?.solutions || []
  );
  const [isAddingSolution, setIsAddingSolution] = useState(false);
  const [isLiked, setIsLiked] = useState(0);
  const [numberOfLikes, setNumberOfLikes] = useState(0);
  const [hasVoted, setHasVoted] = useState<boolean | null>(null);
  const [likeHitReq, { isLoading: likeHitLoading }] = useIssuesLikesMutation();
  const userDataInfo = useSelector((state: RootState) => state.user.userData);

  useEffect(() => {
    async function likeManage() {
      await likeHitReq({
        ISSUE_ID: currentIssue.ID,
        Type: 2,
        USER_ID: userDataInfo?.EmpID,
      }).then((res) => setNumberOfLikes(res?.data?.[0]?.NumberOFLikes));

      await likeHitReq({
        ISSUE_ID: currentIssue.ID,
        Type: 3,
        USER_ID: userDataInfo?.EmpID,
      }).then((res) => setIsLiked(res?.data?.[0]?.LIKES_TYPES));
    }
    likeManage();
  }, []);

  const sortedSolutions = useMemo(() => {
    return [...solutions].sort((a, b) => {
      const avgRatingA = a.reviews.length
        ? a.reviews.reduce((sum, r) => sum + r.rating, 0) / a.reviews.length
        : 0;
      const avgRatingB = b.reviews.length
        ? b.reviews.reduce((sum, r) => sum + r.rating, 0) / b.reviews.length
        : 0;
      return avgRatingB - avgRatingA || b.reviews.length - a.reviews.length;
    });
  }, [solutions]);

  const handleAddSolution = (newSolution: Solution) => {
    setSolutions((prev) => [...prev, newSolution]);
    console.log("NEW solution: ", newSolution);
    setIsAddingSolution(false);
  };

  const handleVote = (type: "up" | "down") => {
    likeHitReq({
      ISSUE_ID: currentIssue.ID,
      Type: 1,
      USER_ID: userDataInfo?.EmpID,
    });
    likeHitReq({
      ISSUE_ID: currentIssue.ID,
      Type: 2,
      USER_ID: userDataInfo?.EmpID,
    });
    setHasVoted(null);
  };

  if (!currentIssue) {
    return (
      <div className="flex items-center justify-center h-64">
        <p>Issue not found</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <Link
          href="/dashboard/issues/"
          className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground mb-4"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to all issues
        </Link>

        <div className="flex flex-wrap gap-2 mb-2">
          {currentIssue.TAGS?.map((tag) => (
            <Badge key={tag} variant="secondary">
              {tag}
            </Badge>
          ))}
        </div>

        <h1
          data-view-transition-name="page-title"
          className="text-3xl font-bold mb-2"
        >
          {currentIssue.TITLE}
        </h1>

        <div className="flex items-center gap-2 text-sm text-muted-foreground mb-6">
          <span>{formatDistanceToNow(currentIssue.CREATED_AT)}</span>
        </div>
      </div>

      <Card>
        <CardContent className="pt-6">
          <div
            className="prose dark:prose-invert max-w-none"
            dangerouslySetInnerHTML={{ __html: currentIssue.CONTENT }}
          />
        </CardContent>
        <CardFooter className="flex justify-between border-t p-4">
          <div className="flex items-center gap-4">
            <Button
              variant={isLiked > 0 ? "default" : "outline"}
              size="sm"
              onClick={() => handleVote("up")}
            >
              <ThumbsUp className="mr-1 h-4 w-4" />
              <span>{numberOfLikes || 0}</span>
            </Button>
            {/* <Button
              variant={hasVoted === false ? "default" : "outline"}
              size="sm"
              onClick={() => handleVote("down")}
            >
              <ThumbsDown className="h-4 w-4" />
            </Button> */}
          </div>
          <div className="flex items-center gap-1">
            <MessageSquare className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm text-muted-foreground">
              {solutions.length} solution{solutions.length !== 1 ? "s" : ""}
            </span>
          </div>
        </CardFooter>
      </Card>

      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold">
            {solutions.length} Solution{solutions.length !== 1 ? "s" : ""}
          </h2>
          {!isAddingSolution && (
            <Button onClick={() => setIsAddingSolution(true)}>
              Add Solution
            </Button>
          )}
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
                  <CreateSolutionForm
                    onSubmit={handleAddSolution}
                    onCancel={() => setIsAddingSolution(false)}
                  />
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
              <p className="text-muted-foreground">
                No solutions yet. Be the first to add one!
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
