"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import moment from "moment";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import {
  Award,
  Calendar,
  Check,
  ChevronDown,
  ChevronUp,
  Copy,
  Mail,
  MessageCircleCodeIcon,
  Share2,
  Star,
} from "lucide-react";
import ReactionPicker from "@/components/shared/ReactionPicker";

interface IssueSolutionsProps {
  ID: number;
  COMPANY_ID: number;
  CONTENT: string;
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

function IssueSolutions({
  solutionData,
}: {
  solutionData: IssueSolutionsProps[];
}) {
  const [expandedSolutions, setExpandedSolutions] = useState<
    Record<number, boolean>
  >({});
  const [copiedId, setCopiedId] = useState<number | null>(null);

  // Find the solution with the highest rating to mark as top solution
  const topSolutionId =
    solutionData.length > 0
      ? solutionData.reduce((prev, current) =>
          current.Rating > prev.Rating ? current : prev
        ).ID
      : null;

  const toggleExpand = (id: number) => {
    setExpandedSolutions((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const copyToClipboard = (id: number, content: string) => {
    // Strip HTML tags for plain text
    const tempDiv = document.createElement("div");
    tempDiv.innerHTML = content;
    const plainText = tempDiv.textContent || tempDiv.innerText || "";

    navigator.clipboard.writeText(plainText).then(() => {
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 2000);
    });
  };

  const shareViaOutlook = (content: string, title: string) => {
    const tempDiv = document.createElement("div");
    tempDiv.innerHTML = content;
    const plainText = tempDiv.textContent || tempDiv.innerText || "";

    const subject = `Check out this solution: ${title}`;
    const body = `I thought you might find this solution helpful:\n\n${plainText}\n\n`;

    window.open(
      `https://outlook.office.com/mail/deeplink/compose?subject=${encodeURIComponent(
        subject
      )}&body=${encodeURIComponent(body)}`
    );
  };

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 },
  };

  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="show"
      className="flex flex-col gap-6 mt-4"
    >
      {solutionData && solutionData.length > 0 ? (
        solutionData.map((solution, i) => (
          <motion.div key={solution.ID} variants={item}>
            <Card
              className={`relative overflow-hidden ${
                solution.ID === topSolutionId
                  ? "border-yellow-400/50 bg-yellow-50/10"
                  : ""
              }`}
            >
              {solution.ID === topSolutionId && (
                <div className="absolute top-0 right-0 bg-yellow-400 text-black rounded-full p-1.5 shadow-md z-10">
                  <Award className="h-4 w-4" />
                </div>
              )}

              <CardHeader className="pb-2 flex flex-row items-center justify-between">
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
                    <div className="font-medium">{solution.FULL_NAME}</div>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <Calendar className="h-3 w-3" />
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <span>
                              {moment(solution.CREATED_AT).format(
                                "MMM DD, YYYY [at] h:mm A"
                              )}
                            </span>
                          </TooltipTrigger>
                          <TooltipContent>
                            {moment(solution.CREATED_AT).format(
                              "MMM DD, YYYY [at] h:mm A"
                            )}
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </div>
                  </div>
                </div>

                {solution.Rating > 0 && (
                  <Badge
                    variant="outline"
                    className="flex items-center gap-1 px-2 py-1"
                  >
                    <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                    <span>{solution.Rating.toFixed(1)}</span>
                  </Badge>
                )}
              </CardHeader>

              <CardContent className="pt-4">
                <div
                  className={`prose dark:prose-invert max-w-none ${
                    !expandedSolutions[solution.ID] &&
                    solution.CONTENT.length > 600
                      ? "max-h-[300px] overflow-hidden relative"
                      : ""
                  }`}
                >
                  <div dangerouslySetInnerHTML={{ __html: solution.CONTENT }} />

                  {!expandedSolutions[solution.ID] &&
                    solution.CONTENT.length > 600 && (
                      <div className="absolute bottom-0 left-0 right-0 h-44 bg-gradient-to-t from-background to-transparent"></div>
                    )}
                </div>

                <div className="flex items-center justify-center">
                  {solution.CONTENT.length > 600 && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => toggleExpand(solution.ID)}
                      className="mt-2 text-muted-foreground hover:text-foreground"
                    >
                      {expandedSolutions[solution.ID] ? (
                        <>
                          Show less <ChevronUp className="ml-1 h-4 w-4" />
                        </>
                      ) : (
                        <>
                          Show more <ChevronDown className="ml-1 h-4 w-4" />
                        </>
                      )}
                    </Button>
                  )}
                </div>
              </CardContent>

              <CardFooter className="flex flex-wrap gap-2 border-t p-4 bg-muted/20">
                <div className="flex items-center gap-4 flex-1">
                  {/* <ReactionPicker
                    isCurrentUserReact={false}
                    totalReactions={0}
                  /> */}

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
                        className="cursor-pointer"
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
                    className="text-muted-foreground hover:text-foreground"
                    onClick={() =>
                      copyToClipboard(solution.ID, solution.CONTENT)
                    }
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

export default IssueSolutions;
