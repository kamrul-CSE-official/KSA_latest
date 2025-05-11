"use client";

import type React from "react";

import { memo, useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  MessageSquare,
  Plus,
  Search,
  ThumbsUp,
  View,
  ChevronDown,
} from "lucide-react";
import { encrypt } from "@/service/encryption";
import { useManageIssuesMutation } from "@/redux/services/issuesApi";
import type { IIssue } from "@/types/globelTypes";
import { Badge } from "@/components/ui/badge";
import sanitizeHtml from "sanitize-html";
import moment from "moment";
import { Skeleton } from "@/components/ui/skeleton";
import { useInView } from "react-intersection-observer";

const IssueCard = ({ issue, index }: { issue: IIssue; index: number }) => {
  return (
    <motion.div
      key={issue.ID}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.3, delay: index * 0.05 }}
      layout
    >
      <Link
        href={`/dashboard/issues/issue?issueId=${encrypt(issue.ID)}`}
        className="block"
        passHref
      >
        <Card className="group overflow-hidden hover:shadow-md transition-all cursor-pointer hover:border-primary/20">
          <CardHeader className="pb-2">
            <CardTitle className="line-clamp-1 text-lg group-hover:text-primary transition-colors">
              {issue.TITLE}
            </CardTitle>
          </CardHeader>

          <CardContent className="relative">
            <div
              className="prose max-w-none line-clamp-3 text-muted-foreground"
              dangerouslySetInnerHTML={{
                __html: issue.CONTENT,
              }}
            />
            <div className="absolute bottom-0 left-0 right-0 h-8 bg-gradient-to-t from-background to-transparent" />

            <div className="flex flex-wrap gap-2 mt-4">
              {issue?.TAG_LIST?.split(",")
                .map((tag) => tag.trim().replace(/^@/, ""))
                .filter(Boolean)
                .slice(0, 3)
                .map((tag) => (
                  <Badge
                    key={tag}
                    variant="outline"
                    className="hover:bg-secondary/80 transition-colors"
                  >
                    {tag}
                  </Badge>
                ))}
              {(issue?.TAG_LIST ?? "").split(",").length > 3 && (
                <Badge variant="outline" className="bg-secondary/10">
                  +{(issue?.TAG_LIST ?? "").split(",").length - 3}
                </Badge>
              )}
            </div>
          </CardContent>

          <CardFooter className="flex flex-col sm:flex-row justify-between text-sm text-muted-foreground gap-2 sm:gap-0 border-t pt-3">
            <div className="flex items-center gap-2">
              <Avatar className="size-6 border">
                <AvatarImage
                  src={`data:image/jpeg;base64,${issue?.IMAGE}`}
                  alt={issue?.FULL_NAME || "User"}
                />
                <AvatarFallback>{issue?.FULL_NAME?.[0] || "U"}</AvatarFallback>
              </Avatar>
              <span className="font-medium">{issue?.FULL_NAME}</span>
              <span className="text-muted-foreground/60">•</span>
              <span className="text-muted-foreground/80">
                {moment(issue.CREATED_AT, "MMM DD YYYY hh:mma").fromNow()}
              </span>
            </div>

            <div className="flex items-center gap-4">
              <div title="Views" className="flex items-center gap-1">
                <View className="size-4 text-muted-foreground/70" />
                <span>{issue?.VIEWS_COUNT || 0}</span>
              </div>
              <div title="Comments" className="flex items-center gap-1">
                <MessageSquare className="size-4 text-muted-foreground/70" />
                <span>{issue?.NUMBER_OF_SULATION || 0}</span>
              </div>
              <div title="Likes" className="flex items-center gap-1">
                <ThumbsUp className="size-4 text-muted-foreground/70" />
                <span>{issue?.LIKES_COUNT || 0}</span>
              </div>
            </div>
          </CardFooter>
        </Card>
      </Link>
    </motion.div>
  );
};

const LoadingSkeleton = () => (
  <div className="space-y-4">
    {[...Array(3)].map((_, i) => (
      <Card key={i} className="overflow-hidden">
        <CardHeader className="pb-2">
          <Skeleton className="h-6 w-3/4" />
        </CardHeader>
        <CardContent className="space-y-2">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-5/6" />
          <Skeleton className="h-4 w-2/3" />
          <div className="flex gap-2 pt-2">
            <Skeleton className="h-6 w-16 rounded-full" />
            <Skeleton className="h-6 w-16 rounded-full" />
          </div>
        </CardContent>
        <CardFooter className="border-t pt-3">
          <div className="flex w-full justify-between">
            <Skeleton className="h-4 w-1/3" />
            <div className="flex gap-2">
              <Skeleton className="size-4 rounded-full" />
              <Skeleton className="size-4 rounded-full" />
              <Skeleton className="size-4 rounded-full" />
            </div>
          </div>
        </CardFooter>
      </Card>
    ))}
  </div>
);

const IssueList = () => {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [pageSize] = useState<number>(10);
  const [pageNumber, setPageNumber] = useState<number>(1);
  const [activeTab, setActiveTab] = useState<
    "latest" | "popular" | "unanswered"
  >("latest");
  const [issuesList, setIssuesList] = useState<IIssue[]>([]);
  const [hasMore, setHasMore] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);

  const { ref: loadMoreRef, inView } = useInView({
    threshold: 0.1,
    triggerOnce: false,
  });

  const [fetchIssues, { isLoading }] = useManageIssuesMutation();

  const fetchMoreIssues = useCallback(async () => {
    if (!hasMore || isLoadingMore) return;

    try {
      setIsLoadingMore(true);
      const newPageNumber = pageNumber + 1;
      const response = await fetchIssues({
        TYPE: activeTab === "latest" ? 2 : activeTab === "popular" ? 3 : 4,
        PageSize: pageSize,
        PageNumber: newPageNumber,
      }).unwrap();

      if (response && response.length > 0) {
        setIssuesList((prev) => [...prev, ...response]);
        setPageNumber(newPageNumber);
      } else {
        setHasMore(false);
      }
    } catch (error) {
      console.error("Failed to fetch more issues:", error);
    } finally {
      setIsLoadingMore(false);
    }
  }, [pageNumber, pageSize, hasMore, isLoadingMore, fetchIssues, activeTab]);

  useEffect(() => {
    const getInitialIssues = async () => {
      try {
        setIssuesList([]);
        setPageNumber(1);
        setHasMore(true);
        const response = await fetchIssues({
          TYPE: activeTab === "latest" ? 1 : activeTab === "popular" ? 3 : 4,
          PageSize: pageSize,
          PageNumber: 1,
        }).unwrap();
        setIssuesList(response || []);
      } catch (error) {
        console.error("Failed to fetch issues:", error);
      }
    };
    getInitialIssues();
  }, [fetchIssues, pageSize, activeTab]);

  useEffect(() => {
    if (inView && hasMore && !isLoadingMore) {
      fetchMoreIssues();
    }
  }, [inView, hasMore, fetchMoreIssues, isLoadingMore]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value.toLowerCase());
  };

  const handleNewIssue = () => {
    router.push("/dashboard/issues/create/");
  };

  const filteredIssues = issuesList.filter((issue) =>
    issue.TITLE.toLowerCase().includes(searchQuery)
  );

  return (
    <div className="space-y-6 pb-8">
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div className="relative w-full sm:w-96">
          <Search className="absolute left-2.5 top-2.5 size-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search issues..."
            className="pl-8"
            value={searchQuery}
            onChange={handleSearchChange}
          />
        </div>
        <Button onClick={handleNewIssue} className="shrink-0 group">
          <Plus className="mr-2 size-4 group-hover:rotate-90 transition-transform duration-200" />
          New Issue
        </Button>
      </div>

      <Tabs
        value={activeTab}
        onValueChange={(value) => setActiveTab(value as any)}
        className="w-full"
      >
        <TabsList className="mb-4 grid w-full grid-cols-3">
          <TabsTrigger value="latest">Latest</TabsTrigger>
          <TabsTrigger value="popular">Popular</TabsTrigger>
          <TabsTrigger value="unanswered">Unanswered</TabsTrigger>
        </TabsList>
        <TabsContent value={activeTab} className="space-y-4">
          {isLoading && issuesList.length === 0 ? (
            <LoadingSkeleton />
          ) : filteredIssues.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
              className="text-center py-12 rounded-lg border border-dashed"
            >
              <p className="text-muted-foreground">
                No issues found. Be the first to create one!
              </p>
              <Button
                variant="outline"
                className="mt-4 group"
                onClick={handleNewIssue}
              >
                <Plus className="mr-2 size-4 group-hover:rotate-90 transition-transform duration-200" />
                Create New Issue
              </Button>
            </motion.div>
          ) : (
            <AnimatePresence>
              <div className="grid gap-4">
                {filteredIssues.map((issue: IIssue, index: number) => (
                  <IssueCard key={issue.ID} issue={issue} index={index} />
                ))}
              </div>
            </AnimatePresence>
          )}

          {/* Loading more indicator */}
          {isLoadingMore && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex justify-center pt-4"
            >
              <div className="flex items-center gap-2 text-muted-foreground bg-background/80 backdrop-blur-sm px-4 py-2 rounded-full shadow-sm">
                <div className="size-4 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                <span>Loading more issues...</span>
              </div>
            </motion.div>
          )}

          {/* Load more trigger */}
          {hasMore && <div ref={loadMoreRef} className="h-1 w-full" />}

          {/* No more issues message */}
          {!hasMore && issuesList.length > 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-6"
            >
              <div className="inline-flex items-center gap-2 text-muted-foreground bg-muted px-4 py-2 rounded-full">
                <span>You've reached the end of the list</span>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-8 gap-1"
                  onClick={() =>
                    window.scrollTo({ top: 0, behavior: "smooth" })
                  }
                >
                  Back to top
                  <ChevronDown className="size-3.5 rotate-180" />
                </Button>
              </div>
            </motion.div>
          )}

          {/* Gradient overlay at the bottom */}
          {filteredIssues.length > 5 && (
            <div className="sticky bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-background to-transparent pointer-events-none" />
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default memo(IssueList);
