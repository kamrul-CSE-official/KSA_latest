"use client";

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
import { MessageSquare, Plus, Search, ThumbsUp, View } from "lucide-react";
import { encrypt } from "@/service/encryption";
import { useManageIssuesMutation } from "@/redux/services/issuesApi";
import type { IIssue } from "@/types/globelTypes";
import { Badge } from "@/components/ui/badge";
import sanitizeHtml from "sanitize-html";
import moment from "moment";
import { Skeleton } from "@/components/ui/skeleton";
import { useInView } from "react-intersection-observer";

const IssueList = () => {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [pageSize, setPageSize] = useState<number>(10);
  const [pageNumber, setPageNumber] = useState<number>(1);
  const [activeTab, setActiveTab] = useState<
    "latest" | "popular" | "unanswered"
  >("latest");
  const [issuesList, setIssuesList] = useState<IIssue[]>([]);
  const [hasMore, setHasMore] = useState(true);

  const { ref: loadMoreRef, inView } = useInView({
    threshold: 0.1,
    triggerOnce: false,
  });

  const [fetchIssues, { isLoading, isSuccess }] = useManageIssuesMutation();

  const fetchMoreIssues = useCallback(async () => {
    if (!hasMore || isSuccess) return;

    try {
      const newPageNumber = pageNumber + 1;
      const response = await fetchIssues({
        TYPE: 2,
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
    }
  }, [pageNumber, pageSize, hasMore, isSuccess, fetchIssues]);

  useEffect(() => {
    const getInitialIssues = async () => {
      try {
        setIssuesList([]);
        setPageNumber(1);
        setHasMore(true);
        const response = await fetchIssues({
          TYPE: 2,
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
    if (inView && hasMore) {
      fetchMoreIssues();
    }
  }, [inView, hasMore, fetchMoreIssues]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value.toLowerCase());
  };

  const handleNewIssue = () => {
    router.push("/dashboard/issues/create/");
  };

  const cleanHtml = (htmlTags: string) => {
    return sanitizeHtml(htmlTags, {
      allowedTags: ["p", "strong", "em", "ul", "li", "ol", "br"],
      allowedAttributes: {},
    });
  };

  const filteredIssues = issuesList.filter((issue) =>
    issue.TITLE.toLowerCase().includes(searchQuery)
  );

  return (
    <div className="space-y-6 pb-8">
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div className="relative w-full sm:w-96">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search issues..."
            className="pl-8"
            value={searchQuery}
            onChange={handleSearchChange}
          />
        </div>
        <Button onClick={handleNewIssue} className="shrink-0">
          <Plus className="mr-2 h-4 w-4" />
          New Issue
        </Button>
      </div>

      <Tabs
        value={activeTab}
        onValueChange={(value) => setActiveTab(value as any)}
      >
        <TabsList className="mb-4 grid w-full grid-cols-3">
          <TabsTrigger value="latest">Latest</TabsTrigger>
          <TabsTrigger value="popular">Popular</TabsTrigger>
          <TabsTrigger value="unanswered">Unanswered</TabsTrigger>
        </TabsList>
        <TabsContent value={activeTab} className="space-y-4">
          {isLoading && issuesList.length === 0 ? (
            <div className="space-y-4">
              {[...Array(3)].map((_, i) => (
                <Card key={i}>
                  <CardHeader>
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
                  <CardFooter>
                    <Skeleton className="h-4 w-1/3" />
                  </CardFooter>
                </Card>
              ))}
            </div>
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
                variant="ghost"
                className="mt-4"
                onClick={handleNewIssue}
              >
                Create New Issue
              </Button>
            </motion.div>
          ) : (
            <AnimatePresence>
              {filteredIssues.map((issue: IIssue, index: number) => (
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
                    <Card className="hover:shadow-md transition-shadow cursor-pointer hover:border-primary/20">
                      <CardHeader className="pb-2">
                        <CardTitle className="line-clamp-1 text-lg">
                          {issue.TITLE}
                        </CardTitle>
                      </CardHeader>

                      <CardContent>
                        <div
                          className="prose max-w-none line-clamp-3 text-muted-foreground"
                          dangerouslySetInnerHTML={{
                            __html: cleanHtml(issue.CONTENT),
                          }}
                        />
                        <div className="flex flex-wrap gap-2 mt-4">
                          {issue?.TAG_LIST?.split(",")
                            .map((tag) => tag.trim().replace(/^@/, ""))
                            .map((tag) => (
                              <Badge
                                key={tag}
                                variant="outline"
                                className="hover:bg-secondary/80 transition-colors"
                              >
                                {tag}
                              </Badge>
                            ))}
                        </div>
                      </CardContent>
                      <CardFooter className="flex flex-col sm:flex-row justify-between text-sm text-muted-foreground gap-2 sm:gap-0">
                        <div className="flex items-center gap-2">
                          <Avatar className="h-6 w-6">
                            <AvatarImage
                              src={`data:image/jpeg;base64,${issue?.IMAGE}`}
                              alt="User avatar"
                            />
                            <AvatarFallback>
                              {issue?.FULL_NAME?.[1]}
                            </AvatarFallback>
                          </Avatar>
                          <span>{issue?.FULL_NAME}</span>
                          <span>•</span>
                          <span>
                            {moment(
                              issue.CREATED_AT,
                              "MMM DD YYYY hh:mma"
                            ).fromNow()}
                          </span>
                        </div>
                        <div className="flex items-center gap-4">
                          <div
                            title="Views"
                            className="flex items-center gap-1"
                          >
                            <View className="h-4 w-4" />
                            <span>{issue?.VIEWS_COUNT}</span>
                          </div>
                          <div
                            title="Comments"
                            className="flex items-center gap-1"
                          >
                            <MessageSquare className="h-4 w-4" />
                            <span>{20}</span>
                          </div>
                          <div
                            title="Likes"
                            className="flex items-center gap-1"
                          >
                            <ThumbsUp className="h-4 w-4" />
                            <span>{issue?.LIKES_COUNT}</span>
                          </div>
                        </div>
                      </CardFooter>
                    </Card>
                  </Link>
                </motion.div>
              ))}
            </AnimatePresence>
          )}

          {/* Loading more indicator */}
          {issuesList.length > 0 && (
            <div className="flex justify-center pt-4">
              <div className="flex items-center gap-2 text-muted-foreground">
                <div className="h-4 w-4 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                Loading more issues...
              </div>
            </div>
          )}

          {/* Load more trigger */}
          {hasMore && (
            <div ref={loadMoreRef} className="h-1 w-full" />
          )}

          {/* No more issues message */}
          {!hasMore && issuesList.length > 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-6 text-muted-foreground"
            >
              You've reached the end of the list
            </motion.div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default memo(IssueList);