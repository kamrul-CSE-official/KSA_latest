"use client"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { cn } from "@/lib/utils"
import { useIssueShareMutation } from "@/redux/services/issuesApi"
import type { RootState } from "@/redux/store"
import { decrypt } from "@/service/encryption"
import { Solution } from "@/types/globelTypes"
import { Home, Layers, FileText, Folder, GitBranch, Plus, type LucideIcon } from "lucide-react"
import { useSearchParams } from "next/navigation"
import { useEffect } from "react"
import { useSelector } from "react-redux"

type MenuItem = {
  icon: LucideIcon
  label: string
  href: string
}

interface HorizontalNavigationProps {
  className?: string
  setLeftNavState: (index: number) => void
  leftNavState: number
  sulations: Solution[]
  numberOfSulation: {
    NUMBER_OF_SULATION: number
    STATUS: number
  }[]
}

const getIconForLabel = (label: string): LucideIcon => {
  const iconMap: Record<string, LucideIcon> = {
    "Root Cause": Home,
    Assumption: Layers,
    Claim: FileText,
    Opinion: Folder,
    Conclusion: GitBranch,
  }
  return iconMap[label] || Folder
}

const labels = ["Root Cause", "Assumption", "Claim", "Opinion", "Conclusion"]

const HorizontalNavigation = ({ className, setLeftNavState, leftNavState, sulations, numberOfSulation }: HorizontalNavigationProps) => {
  const mainMenuItems: MenuItem[] = labels.map((label) => ({
    label,
    href: "#",
    icon: getIconForLabel(label),
  }))

  const [issueShareReq, { isLoading, data }] = useIssueShareMutation()
  const userDetails = useSelector((state: RootState) => state.user.userData)
  const searchParams = useSearchParams()
  const issueId = decrypt(searchParams?.get("issueId") || "")

  useEffect(() => {
    if (issueId && userDetails?.EmpID) {
      issueShareReq({
        Type: 3,
        PersonID: userDetails.EmpID,
        IssueId: issueId,
        StatusID: 1,
      })
    }
  }, [issueId, userDetails, issueShareReq])

  const matchedUser = data?.find(
    (user: { PersonID: number; CreatorID: number }) =>
      user.PersonID === userDetails?.EmpID || user.CreatorID === userDetails?.EmpID,
  )

  return (
    <div className={cn("w-full border-b bg-background/95 backdrop-blur", className)}>
      <div className="flex items-center justify-between py-3">
        {/* Navigation Items */}
        <nav className="flex items-center space-x-1 overflow-x-auto">
          {mainMenuItems.map((item, index) => (
            <Button
              key={item.label}
              onClick={() => setLeftNavState(index)}
              variant={leftNavState === index ? "secondary" : "ghost"}
              size="sm"
              className="flex items-center gap-2 whitespace-nowrap"
            >
              <item.icon className="h-4 w-4" />
              <span className="hidden sm:inline">{item.label}</span>
              {/* <Badge>
                {
                  numberOfSulation && numberOfSulation.find((nos) => nos.STATUS === index - 5)
                    ? numberOfSulation.find((nos) => nos.STATUS === index)?.NUMBER_OF_SULATION
                    : 0
                }
              </Badge> */}
            </Button>
          ))}
        </nav>

        {/* Add Button */}
        <div className="flex items-center gap-2">
          {isLoading && <div className="text-sm text-muted-foreground">Loading...</div>}
          {matchedUser && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button size="sm" className="flex items-center gap-2">
                  <Plus className="h-4 w-4" />
                  <span className="hidden sm:inline">Add</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end">
                {mainMenuItems.map((item, index) => (
                  <DropdownMenuItem key={item.label} onClick={() => setLeftNavState(mainMenuItems.length + index)}>
                    <item.icon className="mr-2 h-4 w-4 text-muted-foreground" />
                    {item.label}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>
      </div>
    </div>
  )
}

export default HorizontalNavigation
