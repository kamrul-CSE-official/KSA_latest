"use client"

import { useEffect, useState, useCallback, useMemo } from "react"
import { useSearchParams } from "next/navigation"
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar"
import { Separator } from "@/components/ui/separator"
import { useIssuesSolutionsMutation } from "@/redux/services/issuesApi"
import { decrypt } from "@/service/encryption"
import type { Solution } from "@/types/globelTypes"
import SulationLeftSidebar from "./sulationLeftSide"
import SulationTopNav from "./sulationTopNav"
import CreateSulation from "./createSulation"
import SulationCard from "./sulationCard"

interface StatCardData {
  NUMBER_OF_SULATION: number
  STATUS: number
}

const STATUS_LABELS = {
  5: "Root Cause",
  6: "Assumption",
  7: "Claim",
  8: "Opinion",
  9: "Conclusion",
} as const

const NAV_LABELS = ["Root Causes", "Assumptions", "Claims", "Opinions", "Conclusions"] as const

const NewIssueSolutions = () => {
  const searchParams = useSearchParams()
  const issueId = useMemo(() => decrypt(searchParams?.get("issueId") || "") || "", [searchParams])

  const [topNavState, setTopNavState] = useState<number>(0)
  const [leftNavState, setLeftNavState] = useState<number>(0)
  const [updateSulation, setUpdateSulation] = useState<number>(0)

  const [sulationReq, { isLoading, data }] = useIssuesSolutionsMutation()
  const [sulationsReq, { isLoading: sulationsLoading, data: sulationsData }] = useIssuesSolutionsMutation()

  // Memoized request functions to prevent unnecessary re-renders
  const fetchSulationStats = useCallback(() => {
    if (issueId) {
      sulationReq({
        Type: 4,
        ISSUES_ID: issueId,
      })
    }
  }, [sulationReq, issueId])

  const fetchSulations = useCallback(() => {
    if (issueId) {
      sulationsReq({
        Type: 6,
        ISSUES_ID: issueId,
        STATUS: leftNavState + 5,
      })
    }
  }, [sulationsReq, issueId, leftNavState])

  // Optimized useEffect hooks
  useEffect(() => {
    fetchSulationStats()
  }, [fetchSulationStats, updateSulation])

  useEffect(() => {
    fetchSulations()
  }, [fetchSulations, updateSulation])

  // Memoized components to prevent unnecessary re-renders
  const StatCards = useMemo(() => {
    if (!data) return null

    return (
      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
        {data.map((type: StatCardData, i: number) => (
          <div key={`${type.STATUS}-${i}`} className="rounded-lg border bg-card p-4 transition-all hover:shadow-md">
            <div className="text-2xl font-bold">{type.NUMBER_OF_SULATION}</div>
            <p className="text-sm text-muted-foreground">
              {STATUS_LABELS[type.STATUS as keyof typeof STATUS_LABELS] || "Unknown"}
            </p>
          </div>
        ))}
      </div>
    )
  }, [data])

  const SulationsList = useMemo(() => {
    if (!sulationsData) return null

    return (
      <div className="space-y-4">
        {sulationsData.map((sulation: Solution) => (
          <SulationCard key={sulation.ID || Math.random()} solution={sulation} />
        ))}
      </div>
    )
  }, [sulationsData])

  const isCreateMode = leftNavState >= 5

  return (
    <SidebarProvider defaultOpen={true}>
      <div className="flex min-h-screen w-full bg-background">
        {/* Sticky Sidebar - Hidden on mobile, shown on desktop */}
        <aside className="hidden lg:block sticky top-0 h-screen w-64 border-r bg-card/50 backdrop-blur supports-[backdrop-filter]:bg-card/50">
          <div className="p-4 h-full overflow-y-auto">
            <SulationLeftSidebar leftNavState={leftNavState} setLeftNavState={setLeftNavState} />
          </div>
        </aside>

        {/* Mobile Sidebar - Overlay */}
        <div className="lg:hidden">
          <SidebarProvider>
            <SulationLeftSidebar leftNavState={leftNavState} setLeftNavState={setLeftNavState} />
          </SidebarProvider>
        </div>

        {/* Main Content */}
        <SidebarInset className="flex flex-1 flex-col min-w-0">
          {/* Top Navigation - Sticky on scroll */}
          {!isCreateMode && (
            <header className="sticky top-0 z-10 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b">
              <SulationTopNav issueId={issueId} topNavState={topNavState} setTopNavState={setTopNavState} />
            </header>
          )}

          {/* Page Content */}
          <main className="flex-1 p-4 md:p-6 lg:p-8">
            {!isCreateMode ? (
              <div className="space-y-6 max-w-7xl mx-auto">
                {/* Stats Cards */}
                {StatCards}

                {/* Content Section */}
                <div className="space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <h3 className="text-xl font-bold">{NAV_LABELS[leftNavState] || "Unknown"}</h3>

                    {/* Debug info - Remove in production */}
                    <div className="text-sm text-muted-foreground space-x-4">
                      <span>Nav: {leftNavState}</span>
                      <span>Top: {topNavState}</span>
                    </div>
                  </div>

                  <Separator />

                  {/* Loading State */}
                  {sulationsLoading && (
                    <div className="flex items-center justify-center py-8">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                      <span className="ml-2 text-muted-foreground">Loading...</span>
                    </div>
                  )}

                  {/* Solutions List */}
                  {SulationsList}

                  {/* Empty State */}
                  {!sulationsLoading && (!sulationsData || sulationsData.length === 0) && (
                    <div className="text-center py-12">
                      <p className="text-muted-foreground">No solutions found</p>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="max-w-4xl mx-auto">
                <CreateSulation
                  setUpdateSulation={setUpdateSulation}
                  updateSulation={updateSulation}
                  leftNavState={leftNavState}
                  setLeftNavState={setLeftNavState}
                  state={leftNavState}
                />
              </div>
            )}
          </main>
        </SidebarInset>
      </div>
    </SidebarProvider>
  )
}

export default NewIssueSolutions
