"use client"

import type React from "react"
import { memo, useEffect, useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  MessageSquare,
  Plus,
  Search,
  ThumbsUp,
  Eye,
  ChevronDown,
  Clock,
  TrendingUp,
  HelpCircle,
  Sparkles,
} from "lucide-react"
import { encrypt } from "@/service/encryption"
import { useManageIssuesMutation } from "@/redux/services/issuesApi"
import type { IIssue } from "@/types/globelTypes"
import { Badge } from "@/components/ui/badge"
import moment from "moment"
import { Skeleton } from "@/components/ui/skeleton"
import { useInView } from "react-intersection-observer"
import { useSelector } from "react-redux"
import type { RootState } from "@/redux/store"

const IssueCard = ({ issue, index }: { issue: IIssue; index: number }) => {
  return (
    <motion.div
      key={issue.ID}
      initial={{ opacity: 0, y: 30, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9, y: -10 }}
      transition={{
        duration: 0.4,
        delay: index * 0.08,
        type: "spring",
        stiffness: 100,
        damping: 15,
      }}
      layout
      whileHover={{ y: -2 }}
      className="group"
    >
      <Link href={`/dashboard/issues/issue?issueId=${encrypt(issue.ID)}`} className="block" passHref>
        <Card className="relative overflow-hidden bg-gradient-to-br from-background via-background to-muted/20 hover:shadow-xl hover:shadow-primary/5 transition-all duration-300 border border-border/50 hover:border-primary/40 backdrop-blur-sm">
          {/* Animated gradient border */}
          <div className="absolute inset-0 bg-gradient-to-r from-primary/20 via-purple-500/20 to-blue-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-xl" />
          <div className="absolute inset-[1px] bg-background rounded-[inherit] z-10" />

          {/* Content */}
          <div className="relative z-20">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between gap-3">
                <CardTitle className="line-clamp-2 text-lg font-semibold group-hover:text-primary transition-colors duration-200 leading-tight">
                  {issue.TITLE}
                </CardTitle>
                <div className="flex items-center gap-1 text-xs text-muted-foreground bg-muted/50 px-2 py-1 rounded-full shrink-0">
                  <Clock className="size-3" />
                 {moment(issue.CREATED_AT, "M/D/YYYY h:mm:ss A Z").format("DD MMM YYYY")}

                </div>
              </div>
            </CardHeader>

            <CardContent className="pb-4">
              <p className="text-muted-foreground line-clamp-3 leading-relaxed mb-4">{issue.SUMMARY}</p>

              {issue?.TAG_LIST && (
                <div className="flex flex-wrap gap-1.5">
                  {issue?.TAG_LIST?.split(",")
                    .map((tag) => tag.trim().replace(/^@/, ""))
                    .filter(Boolean)
                    .slice(0, 4)
                    .map((tag) => (
                      <Badge
                        key={tag}
                        variant="secondary"
                        className="bg-gradient-to-r from-blue-100 to-purple-100 text-blue-800 hover:from-blue-200 hover:to-purple-200 transition-all duration-200 px-3 py-1"
                      >
                        {tag}
                      </Badge>
                    ))}
                  {(issue?.TAG_LIST ?? "").split(",").length > 4 && (
                    <Badge variant="secondary"
                      className="bg-gradient-to-r from-blue-100 to-purple-100 text-blue-800 hover:from-blue-200 hover:to-purple-200 transition-all duration-200 px-3 py-1">
                      +{(issue?.TAG_LIST ?? "").split(",").length - 4}
                    </Badge>
                  )}
                </div>
              )}
            </CardContent>

            <CardFooter className="pt-4 border-t border-border/30">
              <div className="flex items-center justify-between w-full">
                <div className="flex items-center gap-3">
                  <Avatar className="size-8 border-2 border-background shadow-md ring-1 ring-border/20">
                    <AvatarImage src={`data:image/jpeg;base64,${issue?.IMAGE}`} alt={issue?.FULL_NAME || "User"} />
                    <AvatarFallback className="bg-gradient-to-br from-primary/20 to-purple-500/20 text-primary font-semibold text-sm">
                      {issue?.FULL_NAME?.[0] || "U"}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex flex-col">
                    <span className="font-medium text-sm text-foreground">{issue?.FULL_NAME}</span>
                    <span className="text-xs text-muted-foreground">{issue?.DesgName}</span>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    className="flex items-center gap-1.5 group/stat cursor-pointer"
                    title="Views"
                  >
                    <div className="p-1.5 rounded-full bg-blue-500/10 group-hover/stat:bg-blue-500/20 transition-colors">
                      <Eye className="size-3.5 text-blue-600 dark:text-blue-400" />
                    </div>
                    <span className="text-sm font-medium text-muted-foreground group-hover/stat:text-blue-600 transition-colors">
                      {issue?.VIEWS_COUNT || 0}
                    </span>
                  </motion.div>

                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    className="flex items-center gap-1.5 group/stat cursor-pointer"
                    title="Comments"
                  >
                    <div className="p-1.5 rounded-full bg-green-500/10 group-hover/stat:bg-green-500/20 transition-colors">
                      <MessageSquare className="size-3.5 text-green-600 dark:text-green-400" />
                    </div>
                    <span className="text-sm font-medium text-muted-foreground group-hover/stat:text-green-600 transition-colors">
                      {issue?.NUMBER_OF_SULATION || 0}
                    </span>
                  </motion.div>


                </div>
              </div>
            </CardFooter>
          </div>
        </Card>
      </Link>
    </motion.div>
  )
}

const LoadingSkeleton = () => (
  <div className="space-y-6">
    {[...Array(3)].map((_, i) => (
      <motion.div
        key={i}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: i * 0.1 }}
      >
        <Card className="overflow-hidden border border-border/50 bg-gradient-to-br from-background to-muted/20">
          <CardHeader className="pb-3">
            <div className="flex items-start justify-between gap-3">
              <Skeleton className="h-6 w-3/4 bg-gradient-to-r from-muted via-muted/50 to-muted" />
              <Skeleton className="h-6 w-20 rounded-full" />
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-5/6" />
            <Skeleton className="h-4 w-2/3" />
            <div className="flex gap-2 pt-2">
              <Skeleton className="h-6 w-16 rounded-full" />
              <Skeleton className="h-6 w-20 rounded-full" />
              <Skeleton className="h-6 w-14 rounded-full" />
            </div>
          </CardContent>
          <CardFooter className="border-t border-border/30 pt-4">
            <div className="flex w-full justify-between items-center">
              <div className="flex items-center gap-3">
                <Skeleton className="size-8 rounded-full" />
                <div className="space-y-1">
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-3 w-16" />
                </div>
              </div>
              <div className="flex gap-4">
                {[...Array(3)].map((_, j) => (
                  <div key={j} className="flex items-center gap-1.5">
                    <Skeleton className="size-6 rounded-full" />
                    <Skeleton className="h-4 w-6" />
                  </div>
                ))}
              </div>
            </div>
          </CardFooter>
        </Card>
      </motion.div>
    ))}
  </div>
)

const EmptyState = ({ onCreateIssue }: { onCreateIssue: () => void }) => (
  <motion.div
    initial={{ opacity: 0, scale: 0.95 }}
    animate={{ opacity: 1, scale: 1 }}
    transition={{ duration: 0.5 }}
    className="text-center py-20 rounded-2xl border-2 border-dashed border-border/50 bg-gradient-to-br from-muted/20 via-background to-muted/10 relative overflow-hidden"
  >
    <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-purple-500/5 to-blue-500/5 opacity-50" />
    <div className="relative z-10 flex flex-col items-center gap-6 max-w-md mx-auto px-6">
      <div className="relative">
        <div className="p-6 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 text-white">
          <MessageSquare className="size-12 text-white" />
        </div>
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 20, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
          className="absolute -top-2 -right-2 p-2 rounded-full bg-gradient-to-br from-yellow-400/20 to-orange-500/20"
        >
          <Sparkles className="size-4 text-yellow-600" />
        </motion.div>
      </div>
      <div className="space-y-2">
        <h3 className="text-xl font-semibold text-foreground">No incident found</h3>
        <p className="text-muted-foreground leading-relaxed">
          Be the first to create an incident and start the conversation!
        </p>
      </div>
      <Button
        onClick={onCreateIssue}
        size="lg"
        className="group relative overflow-hidden bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-primary/90 hover:to-purple-600/90 shadow-lg hover:shadow-xl transition-all duration-300"
      >
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent"
          initial={{ x: "-100%" }}
          whileHover={{ x: "100%" }}
          transition={{ duration: 0.5 }}
        />
        <Plus className="mr-2 size-5 group-hover:rotate-90 transition-transform duration-300" />
        Create Your First Issue
      </Button>
    </div>
  </motion.div>
)

const IssueList = () => {
  const router = useRouter()
  const [searchQuery, setSearchQuery] = useState<string>("")
  const [pageSize] = useState<number>(10)
  const [pageNumber, setPageNumber] = useState<number>(1)
  const [activeTab, setActiveTab] = useState<"latest" | "popular" | "unanswered">("latest")
  const [issuesList, setIssuesList] = useState<IIssue[]>([])
  const [hasMore, setHasMore] = useState(true)
  const [isLoadingMore, setIsLoadingMore] = useState(false)

  const { ref: loadMoreRef, inView } = useInView({
    threshold: 0.1,
    triggerOnce: false,
  })

  const [fetchIssues, { isLoading }] = useManageIssuesMutation()
  const userDetails = useSelector((state: RootState) => state.user.userData)

  useEffect(() => {
    const getInitialIssues = async () => {
      try {
        setIssuesList([])
        setPageNumber(1)
        setHasMore(true)
        const response = await fetchIssues({
          Type: 2,
          PageSize: pageSize,
          PageNumber: 1,
          USER_ID: userDetails?.EmpID,
        }).unwrap()
        setIssuesList(response || [])
      } catch (error) {
        console.error("Failed to fetch issues:", error)
      }
    }
    getInitialIssues()
  }, [fetchIssues, pageSize, activeTab])

  const handleSearchChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value.toLowerCase())
    const response = await fetchIssues({
      Type: 5,
      PageSize: pageSize,
      PageNumber: 1,
      USER_ID: userDetails?.EmpID,
      SearchText: searchQuery
    }).unwrap()
    if (response[0].ID) {
      setIssuesList(response || []);
    }
  }

  const handleNewIssue = () => {
    router.push("/dashboard/issues/create/")
  }

  const filteredIssues = issuesList?.filter(
    (issue) => issue.TITLE.toLowerCase().includes(searchQuery) || issue.SUMMARY.toLowerCase().includes(searchQuery),
  )


  const myCreation = issuesList?.filter((issue) => issue.USER_ID == userDetails?.EmpID);

  return (
    <div className="space-y-8 pb-8">
      {/* Header Section */}
      <div className="space-y-6">

        <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
          {/* <div className="relative w-full lg:w-96 group">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground group-focus-within:text-primary transition-colors duration-200" />
            <Input
              type="search"
              placeholder="Search incident and solutions..."
              className="pl-10 h-11 border-border/50 focus-visible:ring-2 focus-visible:ring-primary/20 focus-visible:border-primary/50 transition-all duration-200 bg-background/50 backdrop-blur-sm"
              value={searchQuery}
              onChange={handleSearchChange}
            />
          </div> */}

          <Button
            onClick={handleNewIssue}
            size="lg"
            className="shrink-0 group relative overflow-hidden bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg hover:shadow-xl transition-all duration-300"
          >
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent"
              initial={{ x: "-100%" }}
              whileHover={{ x: "100%" }}
              transition={{ duration: 0.5 }}
            />
            <Plus className="mr-2 size-5 group-hover:rotate-90 transition-transform duration-300" />
            New Incident
          </Button>
        </div>
      </div>

      {/* Tabs Section */}
      <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as any)} className="w-full">
        {/* <TabsList className="grid w-full max-w-md grid-cols-3 bg-muted/50 backdrop-blur-sm border border-border/50">
          <TabsTrigger
            value="latest"
            className="flex items-center gap-2 data-[state=active]:bg-background data-[state=active]:shadow-sm"
          >
            <Clock className="size-4" />
            Latest
          </TabsTrigger>
          <TabsTrigger
            value="popular"
            className="flex items-center gap-2 data-[state=active]:bg-background data-[state=active]:shadow-sm"
          >
            <TrendingUp className="size-4" />
            Popular
          </TabsTrigger>
          <TabsTrigger
            value="unanswered"
            className="flex items-center gap-2 data-[state=active]:bg-background data-[state=active]:shadow-sm"
          >
            <HelpCircle className="size-4" />
            Unanswered
          </TabsTrigger>
        </TabsList> */}

        <TabsContent value={activeTab} className="space-y-6 focus-visible:outline-none focus-visible:ring-0 mt-8">
          {isLoading && issuesList?.length === 0 ? (
            <LoadingSkeleton />
          ) : filteredIssues.length === 0 ? (
            <EmptyState onCreateIssue={handleNewIssue} />
          ) : (
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
                className="grid gap-6"
              >
                {filteredIssues.map((issue: IIssue, index: number) => (
                  <IssueCard key={issue.ID} issue={issue} index={index} />
                ))}
              </motion.div>
            </AnimatePresence>
          )}

          {isLoadingMore && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex justify-center pt-8"
            >
              <div className="flex items-center gap-3 text-muted-foreground bg-background/80 backdrop-blur-sm px-6 py-3 rounded-full shadow-lg border border-border/30">
                <div className="size-5 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                <span className="font-medium">Loading more issues...</span>
              </div>
            </motion.div>
          )}

          {hasMore && <div ref={loadMoreRef} className="h-1 w-full" />}

          {!hasMore && issuesList?.length > 0 && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-8">
              <div className="inline-flex items-center gap-3 text-muted-foreground bg-muted/50 px-6 py-3 rounded-full border border-border/30 shadow-sm backdrop-blur-sm">
                <span className="font-medium">You've reached the end</span>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-8 gap-2 hover:bg-background hover:text-primary transition-colors"
                  onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
                >
                  Back to top
                  <ChevronDown className="size-4 rotate-180" />
                </Button>
              </div>
            </motion.div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}

export default memo(IssueList)
