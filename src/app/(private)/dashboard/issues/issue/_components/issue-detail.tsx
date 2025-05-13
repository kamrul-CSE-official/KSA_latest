"use client";

import { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
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
import CreateSolutionForm from "../../_components/create-solution-form";
import {
  useIssuesLikesMutation,
  useIssuesSolutionsMutation,
} from "@/redux/services/issuesApi";
import { useSelector } from "react-redux";
import { Editor } from "@tinymce/tinymce-react";
import { RootState } from "@/redux/store";
import {
  ArrowLeft,
  Calendar,
  Eye,
  Menu,
  MessageSquare,
  Plus,
} from "lucide-react";
import ReactionPicker from "../../../../../../components/shared/ReactionPicker";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Separator } from "@/components/ui/separator";
// import { tinyMceKey } from "@/config/envConfig";
import IssueShare from "./issueShare";

// Import TinyMCE core and required components
import "tinymce/tinymce";
import "tinymce/models/dom"; // DOM model (default)
import "tinymce/themes/silver";
import "tinymce/icons/default";

// Plugins
import "tinymce/plugins/advlist";
import "tinymce/plugins/link";
import "tinymce/plugins/image";
import "tinymce/plugins/lists";
import "tinymce/plugins/charmap";
import "tinymce/plugins/table";
import "tinymce/plugins/code";
import "tinymce/plugins/fullscreen";
import "tinymce/plugins/insertdatetime";
import "tinymce/plugins/media";
import "tinymce/plugins/preview";

// CSS
import "tinymce/skins/ui/oxide/skin.min.css";
import Loading from "@/components/shared/Loading";

interface IssueDetailProps {
  issue: [IIssue];
  numberOfSolutions?: number;
}

export default function IssueDetail({
  issue,
  numberOfSolutions,
}: IssueDetailProps) {
  const currentIssue = issue[0];
  const [solutions, setSolutions] = useState<Solution[]>(
    currentIssue?.solutions || []
  );
  const [isAddingSolution, setIsAddingSolution] = useState(false);
  const [hasVoted, setHasVoted] = useState<boolean | null>(null);
  const [refreshTrigger, setRefreshTrigger] = useState<number>(1);
  const [likeHitReq, { isLoading: likeHitLoading }] = useIssuesLikesMutation();
  const userDataInfo = useSelector((state: RootState) => state.user.userData);
  const [reqForSolution, { isLoading: solutionLoading }] =
    useIssuesSolutionsMutation();

  useEffect(() => {
    async function manageSolutions() {
      try {
        const res = await reqForSolution({
          Type: 2,
          ISSUES_ID: currentIssue.ID,
        });

        if (res?.data) {
          const updatedData = res.data.map((item: any) => {
            return {
              ...item,
              reviews: ["55", "56"],
              replies: ["12", "11"],
            };
          });

          return updatedData;
        }
      } catch (error) {
        console.error("Error managing solutions:", error);
        throw error;
      }
    }
    manageSolutions();
  }, []);

  const handleAddSolution = async (newSolution: Solution) => {
    setSolutions((prev) => [...prev, newSolution]);
    console.log("NEW solution: ", newSolution);
    await reqForSolution({
      ISSUES_ID: currentIssue.ID,
      Type: 3,
      USER_ID: userDataInfo?.EmpID,
      TITLE: currentIssue.TITLE,
      CONTENT: newSolution.content,
      COMPANY_ID: userDataInfo?.CompanyID,
    });
    setIsAddingSolution(false);
  };

  const handleVote = (type: "up" | "down") => {
    likeHitReq({
      ISSUE_ID: currentIssue.ID,
      Type: 4,
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
          className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground mb-6 transition-colors"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to all issues
        </Link>
        {currentIssue?.TAG_LIST?.split(",")?.length &&
          currentIssue?.TAG_LIST?.split(",")?.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="flex flex-wrap gap-2 mb-4"
            >
              {currentIssue?.TAG_LIST?.split(",").map((tag) => (
                <Badge
                  key={tag}
                  variant="secondary"
                  className="px-3 py-1 text-xs"
                >
                  {tag}
                </Badge>
              ))}
            </motion.div>
          )}

        <motion.div
          initial={{ opacity: 0, y: 5 }}
          animate={{ opacity: 1, y: 0 }}
          data-view-transition-name="page-title"
          className="text-3xl font-bold mb-4 leading-tight flex items-center justify-between"
        >
          {currentIssue.TITLE}{" "}
          <div className="flex items-center justify-center gap-1">
            <div className="flex -space-x-1 overflow-hidden">
              {[1, 2, 3, 5]?.map((_, i) => (
                <img
                  key={i}
                  alt=""
                  src="https://images.unsplash.com/photo-1491528323818-fdd1faba62cc?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
                  className="inline-block size-6 rounded-full ring-2 ring-white"
                />
              ))}
            </div>
            {userDataInfo?.EmpID == currentIssue.USER_ID && (
              <IssueShare
                refreshTrigger={refreshTrigger}
                setRefreshTrigger={setRefreshTrigger}
              >
                <Button size="sm">
                  <Menu />
                </Button>
              </IssueShare>
            )}
          </div>
        </motion.div>

        <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-muted-foreground mb-6">
          <div className="flex items-center gap-2">
            <Avatar className="h-6 w-6 border">
              <AvatarImage
                src={`data:image/jpeg;base64,${currentIssue?.IMAGE}`}
                alt={currentIssue?.FULL_NAME || "User"}
              />
              <AvatarFallback>
                {currentIssue?.FULL_NAME?.[0] || "U"}
              </AvatarFallback>
            </Avatar>
            <span className="font-medium text-foreground">
              {currentIssue?.FULL_NAME}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <span>{currentIssue.CREATED_AT}</span>
                </TooltipTrigger>
                <TooltipContent>{currentIssue.CREATED_AT}</TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>

          <div className="flex items-center gap-2">
            <Eye className="h-4 w-4" />
            <span>{currentIssue.VIEWS_COUNT || 0} Times views</span>
          </div>
        </div>
      </div>

      <Card className="overflow-hidden border-border/60">
        <CardContent className="pt-4">
          <Suspense fallback={<Loading />}>
            {userDataInfo?.EmpID == currentIssue.USER_ID ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="prose dark:prose-invert max-w-none"
              >
                <Editor
                  tinymceScriptSrc="/tinymce/tinymce.min.js"
                  value={currentIssue.CONTENT}
                  init={{
                    statusbar: false,
                    skin: false,
                    content_css: false,
                    height: 700,
                    plugins: [
                      "advlist",
                      "autolink",
                      "lists",
                      "link",
                      "image",
                      "charmap",
                      "preview",
                      "anchor",
                      "searchreplace",
                      "visualblocks",
                      "code",
                      "fullscreen",
                      "insertdatetime",
                      "media",
                      "table",
                      "help",
                      "wordcount",
                      "emoticons",
                      "codesample",
                      "textpattern",
                      "tablemerge",
                    ],
                    toolbar:
                      "undo redo | blocks | " +
                      "bold italic forecolor backcolor | alignleft aligncenter " +
                      "alignright alignjustify | bullist numlist outdent indent | " +
                      "link image media table emoticons codesample | " +
                      "removeformat help code fullscreen preview",
                    content_style:
                      "body { font-family:Helvetica,Arial,sans-serif; font-size:16px; padding: 1rem; }",
                  }}
                />
              </motion.div>
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="prose dark:prose-invert max-w-none"
                dangerouslySetInnerHTML={{ __html: currentIssue.CONTENT }}
              />
            )}
          </Suspense>
        </CardContent>
        <CardFooter className="flex justify-between border-t p-4 bg-muted/20">
          <div className="flex items-center gap-4">
            {currentIssue && (
              <ReactionPicker
                onReactionSelect={(reaction) =>
                  alert(`Reaction selected: ${reaction ? reaction : ""}`)
                }
                onClick={() => handleVote("up")}
                reactionType={0}
                isCurrentUserReact={Number(currentIssue?.IsLiked) > 0}
                totalReactions={currentIssue.LIKES_COUNT}
              />
            )}
          </div>
          <div className="flex items-center gap-2 text-muted-foreground">
            <MessageSquare className="h-4 w-4" />
            <span className="text-sm">
              {numberOfSolutions} solution{numberOfSolutions !== 1 ? "s" : ""}
            </span>
          </div>
        </CardFooter>
      </Card>

      <div className="space-y-6 mt-8">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold flex items-center gap-2">
            Solutions
            <Badge variant="outline" className="ml-2 rounded-full">
              {numberOfSolutions}
            </Badge>
          </h2>
          {!isAddingSolution && (
            <Button onClick={() => setIsAddingSolution(true)} className="gap-1">
              <Plus className="h-4 w-4" /> Add Solution
            </Button>
          )}
        </div>
        <Separator className="my-6" />

        <AnimatePresence>
          {isAddingSolution && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
            >
              <Card className="mb-8 border-primary/20 shadow-sm">
                <CardHeader className="pb-2">
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
      </div>
      <br />
    </div>
  );
}
