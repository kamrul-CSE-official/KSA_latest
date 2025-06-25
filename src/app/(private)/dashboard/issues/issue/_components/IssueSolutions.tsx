"use client";

import { useState, useMemo } from "react";
import { useSelector } from "react-redux";
import { motion } from "framer-motion";
import moment from "moment";
import {
  Award,
  Calendar,
  Check,
  ChevronDown,
  ChevronUp,
  Copy,
  MessageCircleCodeIcon,
  Share2,
  Star,
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

import { cn } from "@/lib/utils";
import { useIssueAndSulationLikeMutation } from "@/redux/services/issuesApi";
import { RootState } from "@/redux/store";
import ReactionPicker from "@/components/shared/ReactionPicker";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface IssueSolutionsProps {
  ID: number;
  COMPANY_ID: number;
  CONTENT: string;
  LIKES_COUNT: number;
  LIKES_TYPE: number | null;
  IsLiked: number;
  CREATED_AT: string;
  FULL_NAME: string;
  IMAGE: string;
  ISSUES_ID: number;
  NUMBER_OF_SULATION: number;
  Rating: number;
  STATUS: number;
  TITLE: string;
  Type: number;
  UPDATED_AT: string;
  USER_ID: number;
  VIEWS_COUNT: number;
}

interface Props {
  solutionData: IssueSolutionsProps[];
  isUpdate: number;
  setIsUpdate: (id: number) => void;
}

// Helper
const reactionTypeMapper: Record<string, number> = {
  Like: 1,
  Dislike: 2,
  Celebrate: 3,
  Support: 4,
  Insightful: 5,
  Appreciate: 6,
};

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.1 },
  },
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 },
};

// Main Component
export default function IssueSolutions({
  solutionData,
  isUpdate,
  setIsUpdate,
}: Props) {
  const [expanded, setExpanded] = useState<Record<number, boolean>>({});
  const [copiedId, setCopiedId] = useState<number | null>(null);
  const userData = useSelector((state: RootState) => state.user.userData);
  const [likeMutation] = useIssueAndSulationLikeMutation();

  const topSolutionId = useMemo(() => {
    return solutionData.length
      ? solutionData.reduce((prev, curr) =>
          curr.Rating > prev.Rating ? curr : prev
        ).ID
      : null;
  }, [solutionData]);

  const toggleExpand = (id: number) => {
    setExpanded((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const copyToClipboard = (id: number, html: string) => {
    const temp = document.createElement("div");
    temp.innerHTML = html;
    const plain = temp.textContent || "";
    navigator.clipboard.writeText(plain).then(() => {
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 2000);
    });
  };

  const shareViaOutlook = (html: string, title: string) => {
    const temp = document.createElement("div");
    temp.innerHTML = html;
    const text = temp.textContent || "";
    const url = `https://outlook.office.com/mail/deeplink/compose?subject=${encodeURIComponent(
      `Check out this solution: ${title}`
    )}&body=${encodeURIComponent(
      `I thought you might find this helpful:\n\n${text}`
    )}`;
    window.open(url);
  };

  const handleReactionChange = (reaction: string | null, id: number) => {
    const mapped = reactionTypeMapper[reaction || ""] || 7;
    // alert(`Reaction changed to ${reaction} for solution ${id}.`);
    likeMutation({
      Type: 1,
      USER_ID: userData?.EmpID,
      // ISSUE_ID: null,
      SOLUTION_ID: id,
      // REPLY_ID: null,
      LIKES_TYPES: mapped,
    });
  };

  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="show"
      className="flex flex-col gap-6 mt-4"
    >
      {solutionData.length ? (
        solutionData.map((solution) => (
          <motion.div key={solution.ID} variants={item}>
            <Card
              className={cn(
                "relative overflow-hidden",
                solution.ID === topSolutionId &&
                  "border-yellow-400/50 bg-yellow-50/10"
              )}
            >
              {solution.ID === topSolutionId && (
                <div className="absolute top-0 right-0 bg-yellow-400 text-black rounded-full p-1.5 shadow-md z-10">
                  <Award className="h-4 w-4" />
                </div>
              )}

              <CardHeader className="pb-2 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Avatar className="h-8 w-8 border">
                    <AvatarImage
                      src={`data:image/jpeg;base64,${solution.IMAGE}`}
                      alt={solution.FULL_NAME}
                    />
                    <AvatarFallback>
                      {solution.FULL_NAME.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium">{solution.FULL_NAME}</p>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <Calendar className="h-3 w-3" />
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger>
                            <span>
                              {moment(solution.CREATED_AT).format(
                                "MMM DD, YYYY [at] h:mm A"
                              )}
                            </span>
                          </TooltipTrigger>
                          <TooltipContent>
                            {moment(solution.CREATED_AT).format(
                              "MMMM Do YYYY, h:mm:ss A"
                            )}
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </div>
                  </div>
                </div>

                {/* {solution.Rating > 0 && (
                  <Badge
                    variant="outline"
                    className="flex items-center gap-1 px-2 py-1"
                  >
                    <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                    {solution.Rating.toFixed(1)}
                  </Badge>
                )} */}
              </CardHeader>

              <CardContent className="pt-4">
                <div
                  className={cn(
                    "prose dark:prose-invert max-w-none",
                    !expanded[solution.ID] &&
                      solution.CONTENT.length > 600 &&
                      "max-h-[300px] overflow-hidden relative"
                  )}
                >
                  <div dangerouslySetInnerHTML={{ __html: solution.CONTENT }} />
                  {!expanded[solution.ID] && solution.CONTENT.length > 600 && (
                    <div className="absolute bottom-0 left-0 right-0 h-44 bg-gradient-to-t from-background to-transparent"></div>
                  )}
                </div>

                {solution.CONTENT.length > 600 && (
                  <div className="flex justify-center mt-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-muted-foreground hover:text-foreground"
                      onClick={() => toggleExpand(solution.ID)}
                    >
                      {expanded[solution.ID] ? (
                        <>
                          Show less <ChevronUp className="ml-1 h-4 w-4" />
                        </>
                      ) : (
                        <>
                          Show more <ChevronDown className="ml-1 h-4 w-4" />
                        </>
                      )}
                    </Button>
                  </div>
                )}
              </CardContent>

              <CardFooter className="flex flex-wrap gap-2 border-t p-4 bg-muted/20">
                <div className="flex items-center gap-4 flex-1">
                  <ReactionPicker
                    key={solution.ID}
                    solutionId={solution.ID}                    
                    defaultReaction={
                      solution.LIKES_TYPE
                        ? Object.keys(reactionTypeMapper).find(
                            (key) =>
                              reactionTypeMapper[key] === solution.LIKES_TYPE
                          )
                        : null
                    }
                    // totalReactions={solution.LIKES_COUNT}
                    totalReactions={solution.Rating}
                    isCurrentUserReact={solution.IsLiked ? true : false}
                    onChange={(reaction) =>
                      handleReactionChange(reaction, solution.ID)
                    }
                  />

                  <Separator orientation="vertical" className="h-6" />

                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm">
                        <Share2 />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="start">
                      <DropdownMenuItem
                        onClick={() =>
                          shareViaOutlook(solution.CONTENT, solution.TITLE)
                        }
                      >
                        <MessageCircleCodeIcon />
                        Share via Outlook
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>

                  <Separator orientation="vertical" className="h-6" />

                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() =>
                      copyToClipboard(solution.ID, solution.CONTENT)
                    }
                    className="text-muted-foreground hover:text-foreground"
                  >
                    {copiedId === solution.ID ? (
                      <>
                        <Check className="mr-1 h-4 w-4 text-green-500" />
                        Copied
                      </>
                    ) : (
                      <>
                        <Copy className="mr-1 h-4 w-4" />
                        Copy
                      </>
                    )}
                  </Button>
                </div>

                {solution.ID === topSolutionId && (
                  <Badge
                    variant="outline"
                    className="bg-yellow-50 text-yellow-700 border-yellow-200"
                  >
                    Top Solution
                  </Badge>
                )}
              </CardFooter>
            </Card>
          </motion.div>
        ))
      ) : (
        <Card className="bg-muted/50">
          <CardContent className="py-12 text-center">
            <p className="text-muted-foreground">
              No solutions yet. Be the first to add one!
            </p>
          </CardContent>
        </Card>
      )}
    </motion.div>
  );
}
