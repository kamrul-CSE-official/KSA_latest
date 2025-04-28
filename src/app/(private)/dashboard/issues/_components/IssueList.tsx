"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { MessageSquare, Plus, Search, ThumbsUp } from "lucide-react";
import { mockIssues } from "@/lib/mock-data";
import { formatDistanceToNow } from "@/lib/utils";
import { encrypt } from "@/service/encryption";
import { useManageIssuesMutation } from "@/redux/services/issuesApi";

export default function IssueList() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("latest");
  const [reqForIssues, { isLoading, data: issuesData }] =
    useManageIssuesMutation(undefined);

  useEffect(() => {
    const fetchIssues = async () => {
      try {
        await reqForIssues({
          TYPE: 1,
        }).unwrap();
      } catch (error) {
        console.error("Failed to fetch issues:", error);
      }
    };

    fetchIssues();
  }, []);

  console.log("issuesData::::  ", issuesData);

  const filteredIssues = mockIssues.filter(
    (issue) =>
      issue.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      issue.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
      issue.tags.some((tag) =>
        tag.toLowerCase().includes(searchQuery.toLowerCase())
      )
  );

  const sortedIssues = [...filteredIssues].sort((a, b) => {
    if (activeTab === "latest") {
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    } else if (activeTab === "popular") {
      return b.solutions.length - a.solutions.length;
    } else if (activeTab === "unanswered") {
      return a.solutions.length - b.solutions.length;
    }
    return 0;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div className="relative w-full sm:w-96">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search issues..."
            className="pl-8"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <Button onClick={() => router.push("/dashboard/issues/create/")}>
          <Plus className="mr-2 h-4 w-4" />
          New Issue
        </Button>
      </div>

      <Tabs defaultValue="latest" onValueChange={setActiveTab}>
        <TabsList className="mb-4">
          <TabsTrigger value="latest">Latest</TabsTrigger>
          <TabsTrigger value="popular">Most Answered</TabsTrigger>
          <TabsTrigger value="unanswered">Unanswered</TabsTrigger>
        </TabsList>

        <TabsContent value={activeTab} className="space-y-4">
          {issuesData?.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground">
                No issues found. Be the first to create one!
              </p>
            </div>
          ) : (
            sortedIssues.map((issue, index) => (
              <motion.div
                key={issue.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
              >
                <Link
                  href={`/dashboard/issues/issue?issueId=${encrypt(issue.id)}`}
                  className="block"
                >
                  <Card className="hover:shadow-md transition-shadow">
                    <CardHeader className="pb-2">
                      <div className="flex justify-between">
                        <CardTitle className="line-clamp-1">
                          {issue.title}
                        </CardTitle>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-muted-foreground line-clamp-2 mb-3">
                        {issue.content.replace(/<[^>]*>/g, "")}
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {issue.tags.map((tag) => (
                          <Badge key={tag} variant="secondary">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    </CardContent>
                    <CardFooter className="flex justify-between text-sm text-muted-foreground">
                      <div className="flex items-center gap-2">
                        <Avatar className="h-6 w-6">
                          <AvatarImage
                            src={issue.author.avatar || "/placeholder.svg"}
                          />
                          <AvatarFallback>
                            {issue.author.name.charAt(0)}
                          </AvatarFallback>
                        </Avatar>
                        <span>{issue.author.name}</span>
                        <span>•</span>
                        <span>{formatDistanceToNow(issue.createdAt)}</span>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="flex items-center gap-1">
                          <MessageSquare className="h-4 w-4" />
                          <span>{issue.solutions.length}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <ThumbsUp className="h-4 w-4" />
                          <span>{issue.votes}</span>
                        </div>
                      </div>
                    </CardFooter>
                  </Card>
                </Link>
              </motion.div>
            ))
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
