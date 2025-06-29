"use client"

import { useState, useMemo } from "react"
import { useSelector } from "react-redux"
import { motion } from "framer-motion"
import moment from "moment"
import {
  Award,
  Calendar,
  Check,
  ChevronDown,
  ChevronUp,
  Copy,
  MessageCircle,
  Share2,
  Star,
  TrendingUp,
  Users,
  Home,
  ShoppingBag,
  CalendarDays,
  Settings,
  Bell,
  Search,
  Filter,
  BookOpen,
  HelpCircle,
  Menu,
  ChevronRight,
  Activity,
  FileText,
  Tag,
} from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { cn } from "@/lib/utils"
import { useIssueAndSulationLikeMutation } from "@/redux/services/issuesApi"
import type { RootState } from "@/redux/store"
import ReactionPicker from "@/components/shared/ReactionPicker"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import { Sheet, SheetContent } from "@/components/ui/sheet"

interface IssueSolutionsProps {
  ID: number
  COMPANY_ID: number
  CONTENT: string
  LIKES_COUNT: number
  LIKES_TYPE: number | null
  IsLiked: number
  CREATED_AT: string
  FULL_NAME: string
  IMAGE: string
  ISSUES_ID: number
  NUMBER_OF_SULATION: number
  Rating: number
  STATUS: number
  TITLE: string
  Type: number
  UPDATED_AT: string
  USER_ID: number
  VIEWS_COUNT: number
}

interface Props {
  solutionData: IssueSolutionsProps[]
  isUpdate: number
  setIsUpdate: (id: number) => void
}

const reactionTypeMapper: Record<string, number> = {
  Like: 1,
  Dislike: 2,
  Celebrate: 3,
  Support: 4,
  Insightful: 5,
  Appreciate: 6,
}

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.1 },
  },
}

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 },
}

// Left Sidebar Component
const LeftSidebar = ({ className }: { className?: string }) => {
  const mainMenuItems = [
    { icon: Home, label: "Home", href: "/", active: true },
    { icon: ShoppingBag, label: "Issues", href: "/issues" },
    { icon: CalendarDays, label: "Calendar", href: "/calendar" },
    { icon: FileText, label: "Documents", href: "/documents" },
    { icon: Users, label: "Teams", href: "/teams" },
  ]

  const secondaryItems = [
    { icon: Settings, label: "Settings", href: "/settings" },
    { icon: HelpCircle, label: "Help & Support", href: "/help" },
    { icon: Bell, label: "Notifications", href: "/notifications" },
  ]

  return (
    <div className={cn("flex flex-col h-full", className)}>
      <div className="p-4 border-b">
        <h2 className="font-semibold text-lg">Navigation</h2>
      </div>

      <div className="flex-1 p-4 space-y-6">
        <div className="space-y-2">
          <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Main</h3>
          <nav className="space-y-1">
            {mainMenuItems.map((item) => (
              <Button
                key={item.label}
                variant={item.active ? "secondary" : "ghost"}
                className="w-full justify-start gap-3 h-10"
                asChild
              >
                <a href={item.href}>
                  <item.icon className="h-4 w-4" />
                  {item.label}
                  {item.active && <ChevronRight className="h-4 w-4 ml-auto" />}
                </a>
              </Button>
            ))}
          </nav>
        </div>

        <Separator />

        <div className="space-y-2">
          <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Account</h3>
          <nav className="space-y-1">
            {secondaryItems.map((item) => (
              <Button key={item.label} variant="ghost" className="w-full justify-start gap-3 h-10" asChild>
                <a href={item.href}>
                  <item.icon className="h-4 w-4" />
                  {item.label}
                </a>
              </Button>
            ))}
          </nav>
        </div>
      </div>

      <div className="p-4 border-t">
        <div className="flex items-center gap-3">
          <Avatar className="h-8 w-8">
            <AvatarFallback>JD</AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium truncate">John Doe</p>
            <p className="text-xs text-muted-foreground truncate">john@company.com</p>
          </div>
        </div>
      </div>
    </div>
  )
}

// Right Sidebar Component
const RightSidebar = ({ className }: { className?: string }) => {
  const quickActions = [
    { icon: Search, label: "Search Solutions", action: () => {} },
    { icon: Filter, label: "Filter Results", action: () => {} },
    { icon: BookOpen, label: "Documentation", action: () => {} },
    { icon: Tag, label: "Tags", action: () => {} },
  ]

  const recentActivity = [
    { user: "Alice Johnson", action: "added a solution", time: "2 hours ago" },
    { user: "Bob Smith", action: "liked a solution", time: "4 hours ago" },
    { user: "Carol Davis", action: "commented on issue", time: "6 hours ago" },
    { user: "David Wilson", action: "created new issue", time: "1 day ago" },
  ]

  return (
    <div className={cn("flex flex-col h-full", className)}>
      <div className="p-4 border-b">
        <h2 className="font-semibold text-lg">Quick Actions</h2>
      </div>

      <div className="flex-1 p-4 space-y-6">
        <div className="space-y-3">
          {quickActions.map((action) => (
            <Button
              key={action.label}
              variant="outline"
              className="w-full justify-start gap-3 h-10"
              onClick={action.action}
            >
              <action.icon className="h-4 w-4" />
              {action.label}
            </Button>
          ))}
        </div>

        <Separator />

        <div className="space-y-3">
          <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Recent Activity</h3>
          <div className="space-y-3">
            {recentActivity.map((activity, index) => (
              <div
                key={index}
                className="flex items-start gap-3 p-3 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors"
              >
                <Activity className="h-4 w-4 text-muted-foreground mt-0.5 flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm">
                    <span className="font-medium">{activity.user}</span>{" "}
                    <span className="text-muted-foreground">{activity.action}</span>
                  </p>
                  <p className="text-xs text-muted-foreground">{activity.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <Separator />

        <div className="space-y-3">
          <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Statistics</h3>
          <div className="grid grid-cols-1 gap-3">
            <Card className="p-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Total Solutions</span>
                <span className="text-lg font-semibold">24</span>
              </div>
            </Card>
            <Card className="p-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">This Week</span>
                <span className="text-lg font-semibold text-green-600">+5</span>
              </div>
            </Card>
            <Card className="p-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Top Rated</span>
                <div className="flex items-center gap-1">
                  <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
                  <span className="text-sm font-semibold">4.8</span>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function IssueSolutions({ solutionData, isUpdate, setIsUpdate }: Props) {
  const [expanded, setExpanded] = useState<Record<number, boolean>>({})
  const [copiedId, setCopiedId] = useState<number | null>(null)
  const [leftSidebarOpen, setLeftSidebarOpen] = useState(false)
  const [rightSidebarOpen, setRightSidebarOpen] = useState(false)
  const userData = useSelector((state: RootState) => state.user.userData)
  const [likeMutation] = useIssueAndSulationLikeMutation()

  const topSolutionId = useMemo(() => {
    return solutionData.length
      ? solutionData.reduce((prev, curr) => (curr.Rating > prev.Rating ? curr : prev)).ID
      : null
  }, [solutionData])

  const sortedSolutions = useMemo(() => {
    return [...solutionData].sort((a, b) => {
      if (a.ID === topSolutionId) return -1
      if (b.ID === topSolutionId) return 1
      return b.Rating - a.Rating
    })
  }, [solutionData, topSolutionId])

  const toggleExpand = (id: number) => {
    setExpanded((prev) => ({ ...prev, [id]: !prev[id] }))
  }

  const copyToClipboard = async (id: number, html: string) => {
    const temp = document.createElement("div")
    temp.innerHTML = html
    const plain = temp.textContent || ""

    try {
      await navigator.clipboard.writeText(plain)
      setCopiedId(id)
      setTimeout(() => setCopiedId(null), 2000)
    } catch (err) {
      console.error("Failed to copy text: ", err)
    }
  }

  const shareViaOutlook = (html: string, title: string) => {
    const temp = document.createElement("div")
    temp.innerHTML = html
    const text = temp.textContent || ""
    const url = `https://outlook.office.com/mail/deeplink/compose?subject=${encodeURIComponent(
      `Check out this solution: ${title}`,
    )}&body=${encodeURIComponent(`I thought you might find this helpful:\n\n${text}`)}`
    window.open(url, "_blank")
  }

  const handleReactionChange = (reaction: string | null, id: number) => {
    const mapped = reactionTypeMapper[reaction || ""] || 7
    likeMutation({
      Type: 1,
      USER_ID: userData?.EmpID,
      SOLUTION_ID: id,
      LIKES_TYPES: mapped,
    })
  }

  return (
    <div className="flex h-screen bg-background">
      {/* Left Sidebar - Desktop */}
      <div className="hidden lg:flex w-64 border-r bg-card">
        <LeftSidebar />
      </div>

      {/* Mobile Sidebar Sheets */}
      <Sheet open={leftSidebarOpen} onOpenChange={setLeftSidebarOpen}>
        <SheetContent side="left" className="w-64 p-0">
          <LeftSidebar />
        </SheetContent>
      </Sheet>

      <Sheet open={rightSidebarOpen} onOpenChange={setRightSidebarOpen}>
        <SheetContent side="right" className="w-80 p-0">
          <RightSidebar />
        </SheetContent>
      </Sheet>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Mobile Header */}
        <div className="lg:hidden flex items-center justify-between p-4 border-b bg-card">
          <Button variant="ghost" size="sm" onClick={() => setLeftSidebarOpen(true)} className="lg:hidden">
            <Menu className="h-5 w-5" />
          </Button>
          <h1 className="font-semibold">Issue Solutions</h1>
          <Button variant="ghost" size="sm" onClick={() => setRightSidebarOpen(true)} className="lg:hidden">
            <Filter className="h-5 w-5" />
          </Button>
        </div>

        {/* Solutions Content */}
        <div className="flex-1 overflow-auto">
          <div className="max-w-4xl mx-auto p-4 lg:p-8">
            {!solutionData.length ? (
              <Card className="bg-gradient-to-br from-muted/30 to-muted/10 border-dashed">
                <CardContent className="py-16 text-center">
                  <div className="mx-auto w-16 h-16 bg-muted rounded-full flex items-center justify-center mb-4">
                    <MessageCircle className="h-8 w-8 text-muted-foreground" />
                  </div>
                  <h3 className="text-lg font-semibold mb-2">No solutions yet</h3>
                  <p className="text-muted-foreground max-w-md mx-auto">
                    Be the first to contribute a solution to this issue. Your expertise could help others facing similar
                    challenges.
                  </p>
                </CardContent>
              </Card>
            ) : (
              <>
                {/* Solutions Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                  <div className="flex items-center gap-3">
                    <h2 className="text-xl font-semibold">Solutions</h2>
                    <Badge variant="secondary" className="flex items-center gap-1">
                      <Users className="h-3 w-3" />
                      {solutionData.length}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <TrendingUp className="h-4 w-4" />
                    <span>Sorted by rating</span>
                  </div>
                </div>

                {/* Search Bar */}
                <div className="mb-6">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input placeholder="Search solutions..." className="pl-10" />
                  </div>
                </div>

                {/* Solutions List */}
                <motion.div variants={container} initial="hidden" animate="show" className="space-y-6">
                  {sortedSolutions.map((solution, index) => (
                    <motion.div key={solution.ID} variants={item}>
                      <Card
                        className={cn(
                          "relative overflow-hidden transition-all duration-200 hover:shadow-md",
                          solution.ID === topSolutionId &&
                            "border-amber-200 bg-gradient-to-br from-amber-50/50 to-yellow-50/30 dark:from-amber-950/20 dark:to-yellow-950/10",
                        )}
                      >
                        {/* Top Solution Badge */}
                        {solution.ID === topSolutionId && (
                          <div className="absolute top-4 right-4 z-10">
                            <Badge className="bg-amber-500 hover:bg-amber-600 text-white shadow-lg">
                              <Award className="h-3 w-3 mr-1" />
                              Top Solution
                            </Badge>
                          </div>
                        )}

                        <CardHeader className="pb-4">
                          <div className="flex items-start justify-between">
                            <div className="flex items-center gap-3">
                              <Avatar className="h-10 w-10 border-2 border-background shadow-sm">
                                <AvatarImage
                                  src={`data:image/jpeg;base64,${solution.IMAGE}`}
                                  alt={solution.FULL_NAME}
                                />
                                <AvatarFallback className="bg-primary/10 text-primary font-medium">
                                  {solution.FULL_NAME.charAt(0).toUpperCase()}
                                </AvatarFallback>
                              </Avatar>
                              <div className="space-y-1">
                                <p className="font-medium text-foreground">{solution.FULL_NAME}</p>
                                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                  <Calendar className="h-3 w-3" />
                                  <TooltipProvider>
                                    <Tooltip>
                                      <TooltipTrigger asChild>
                                        <span className="hover:text-foreground cursor-help">
                                          {moment(solution.CREATED_AT).fromNow()}
                                        </span>
                                      </TooltipTrigger>
                                      <TooltipContent>
                                        <p>{moment(solution.CREATED_AT).format("MMMM Do YYYY, h:mm:ss A")}</p>
                                      </TooltipContent>
                                    </Tooltip>
                                  </TooltipProvider>
                                </div>
                              </div>
                            </div>

                            {solution.Rating > 0 && (
                              <Badge variant="outline" className="flex items-center gap-1">
                                <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
                                <span className="font-medium">{solution.Rating.toFixed(1)}</span>
                              </Badge>
                            )}
                          </div>
                        </CardHeader>

                        <CardContent className="pt-0">
                          <div
                            className={cn(
                              "prose prose-sm dark:prose-invert max-w-none",
                              "prose-headings:text-foreground prose-p:text-muted-foreground",
                              "prose-strong:text-foreground prose-code:text-foreground",
                              !expanded[solution.ID] &&
                                solution.CONTENT.length > 600 &&
                                "max-h-[200px] overflow-hidden relative",
                            )}
                          >
                            <div dangerouslySetInnerHTML={{ __html: solution.CONTENT }} />
                            {!expanded[solution.ID] && solution.CONTENT.length > 600 && (
                              <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-background via-background/80 to-transparent" />
                            )}
                          </div>

                          {solution.CONTENT.length > 600 && (
                            <div className="flex justify-center mt-4">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => toggleExpand(solution.ID)}
                                className="text-muted-foreground hover:text-foreground"
                              >
                                {expanded[solution.ID] ? (
                                  <>
                                    Show less <ChevronUp className="ml-1 h-4 w-4" />
                                  </>
                                ) : (
                                  <>
                                    Read more <ChevronDown className="ml-1 h-4 w-4" />
                                  </>
                                )}
                              </Button>
                            </div>
                          )}
                        </CardContent>

                        <CardFooter className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-t bg-muted/20 p-4">
                          <div className="flex items-center gap-2 flex-wrap">
                            <ReactionPicker
                              key={solution.ID}
                              solutionId={solution.ID}
                              defaultReaction={
                                solution.LIKES_TYPE
                                  ? Object.keys(reactionTypeMapper).find(
                                      (key) => reactionTypeMapper[key] === solution.LIKES_TYPE,
                                    )
                                  : null
                              }
                              totalReactions={solution.Rating}
                              isCurrentUserReact={solution.IsLiked ? true : false}
                              onChange={(reaction) => handleReactionChange(reaction, solution.ID)}
                            />

                            <Separator orientation="vertical" className="h-6 mx-2 hidden sm:block" />

                            <TooltipProvider>
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => copyToClipboard(solution.ID, solution.CONTENT)}
                                    className="text-muted-foreground hover:text-foreground"
                                  >
                                    {copiedId === solution.ID ? (
                                      <Check className="h-4 w-4 text-green-500" />
                                    ) : (
                                      <Copy className="h-4 w-4" />
                                    )}
                                  </Button>
                                </TooltipTrigger>
                                <TooltipContent>
                                  <p>{copiedId === solution.ID ? "Copied!" : "Copy solution"}</p>
                                </TooltipContent>
                              </Tooltip>
                            </TooltipProvider>

                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="text-muted-foreground hover:text-foreground"
                                >
                                  <Share2 className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem
                                  onClick={() => shareViaOutlook(solution.CONTENT, solution.TITLE)}
                                  className="cursor-pointer"
                                >
                                  <MessageCircle className="h-4 w-4 mr-2" />
                                  Share via Outlook
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </div>

                          <div className="text-xs text-muted-foreground">Solution #{index + 1}</div>
                        </CardFooter>
                      </Card>
                    </motion.div>
                  ))}
                </motion.div>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Right Sidebar - Desktop */}
      <div className="hidden xl:flex w-80 border-l bg-card">
        <RightSidebar />
      </div>
    </div>
  )
}
