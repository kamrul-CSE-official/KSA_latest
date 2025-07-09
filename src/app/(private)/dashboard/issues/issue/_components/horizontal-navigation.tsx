"use client"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { cn } from "@/lib/utils"
import { useIssueShareMutation, useIssuesSolutionsMutation } from "@/redux/services/issuesApi"
import type { RootState } from "@/redux/store"
import { decrypt } from "@/service/encryption"
import { IIssue, Solution } from "@/types/globelTypes"
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
  issue: IIssue
  isUpdate: number
  setIsUpdate: any
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

const HorizontalNavigation = ({ className, setLeftNavState, leftNavState, sulations, numberOfSulation, issue, setIsUpdate, isUpdate }: HorizontalNavigationProps) => {
  const mainMenuItems: MenuItem[] = labels.map((label) => ({
    label,
    href: "#",
    icon: getIconForLabel(label),
  }))

  const [issueShareReq, { isLoading, data }] = useIssueShareMutation()
  const [reqForSolution, { data: sulationsData }] = useIssuesSolutionsMutation();

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
      });

      reqForSolution({
        Type: 12,
        ISSUES_ID: issueId,
        USER_ID: userDetails.EmpID,
      });

      // setIsUpdate(isUpdate + 1);
    }
  }, [issueId, userDetails, issueShareReq, reqForSolution])

  const matchedUser = data?.find(
    (user: { PersonID: number; CreatorID: number }) =>
      user.PersonID === userDetails?.EmpID || user.CreatorID === userDetails?.EmpID,
  )

  const filterRoot = sulationsData?.filter((sulation: { STATUS: number }) => sulation?.STATUS === 5)[0]?.Type || 0;
  const filterAssum = sulationsData?.filter((sulation: { STATUS: number }) => sulation?.STATUS === 6)[0]?.Type || 0;
  const filterClaim = sulationsData?.filter((sulation: { STATUS: number }) => sulation?.STATUS === 7)[0]?.Type || 0;
  const filterOpin = sulationsData?.filter((sulation: { STATUS: number }) => sulation?.STATUS === 8)[0]?.Type || 0;
  const filterConc = sulationsData?.filter((sulation: { STATUS: number }) => sulation?.STATUS === 9)[0]?.Type || 0;



  const statusCounts = {
    [labels[0]]: filterRoot,
    [labels[1]]: filterAssum,
    [labels[2]]: filterClaim,
    [labels[3]]: filterOpin,
    [labels[4]]: filterConc,
  };

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
              <Badge>
                {statusCounts[item.label] || 0}
              </Badge>
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
