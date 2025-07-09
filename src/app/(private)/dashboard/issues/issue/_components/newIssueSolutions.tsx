"use client"

import { useEffect, useState, useCallback, useMemo } from "react"
import { useSearchParams } from "next/navigation"
import { useSelector } from "react-redux"
import { Separator } from "@/components/ui/separator"
import { Loader2 } from "lucide-react"
import { useIssueShareMutation, useIssuesSolutionsMutation } from "@/redux/services/issuesApi"
import { decrypt } from "@/service/encryption"
import type { IIssue, Solution } from "@/types/globelTypes"
import type { RootState } from "@/redux/store"
import HorizontalNavigation from "./horizontal-navigation"
import SulationTopNav from "./sulationTopNav"
import CreateSulation from "./createSulation"
import SulationCard from "./sulationCard"



const NAV_LABELS = ["Root Causes", "Assumptions", "Claims", "Opinions", "Conclusions"] as const


interface ComponentState {
  topNavState: number
  leftNavState: number
  updateSulation: number
  dptSearch: string
  sulations: Solution[]
}

const NewIssueSolutions = ({ issue, isUpdate, setIsUpdate }: { issue: IIssue, isUpdate: number, setIsUpdate: any }) => {
  const searchParams = useSearchParams()
  const userDetails = useSelector((state: RootState) => state.user.userData)

  // Memoized values
  const issueId = useMemo(() => {
    const encryptedId = searchParams?.get("issueId")
    return encryptedId ? decrypt(encryptedId) : ""
  }, [searchParams])

  // Consolidated state
  const [state, setState] = useState<ComponentState>({
    topNavState: 0,
    leftNavState: 0,
    updateSulation: 0,
    dptSearch: "",
    sulations: [],
  })

  // API hooks
  const [sulationReq, { data: statsData, isLoading: statsLoading, error: statsError }] = useIssuesSolutionsMutation()
  const [sulationsReq, { isLoading: sulationsLoading, error: sulationsError }] = useIssuesSolutionsMutation()
  const [issueShareReq] = useIssueShareMutation()



  useEffect(() => {
    sulationReq({
      Type: 4,
      ISSUES_ID: issueId,
    })
  }, [sulationReq, issueId]);


  // Update state helper
  const updateState = useCallback((updates: Partial<ComponentState>) => {
    setState((prev) => ({ ...prev, ...updates }))
  }, [])

  // API call functions
  const fetchSulationStats = useCallback(async () => {
    if (!issueId) return

    try {
      await sulationReq({
        Type: 4,
        ISSUES_ID: issueId,
      })
    } catch (error) {
      console.error("Failed to fetch solution stats:", error)
    }
  }, [sulationReq, issueId])

  const fetchSulations = useCallback(async () => {
    if (!issueId) return

    try {
      const result = await sulationsReq({
        Type: 6,
        ISSUES_ID: issueId,
        STATUS: state.leftNavState + 5,
      }).unwrap()

      updateState({ sulations: result || [] })
    } catch (error) {
      console.error("Failed to fetch solutions:", error)
      updateState({ sulations: [] })
    }
  }, [sulationsReq, issueId, state.leftNavState, updateState])

  const searchDepartmentWise = useCallback(
    async (dept: string) => {
      if (!issueId) return

      try {
        const result = await sulationsReq({
          Type: 8,
          ISSUES_ID: issueId,
          STATUS: state.leftNavState + 5,
          DEPTNAME: dept,
        }).unwrap()

        updateState({ sulations: result || [] })
      } catch (error) {
        console.error("Failed to search by department:", error)
        updateState({ sulations: [] })
      }
    },
    [sulationsReq, issueId, state.leftNavState, updateState],
  )

  const fetchIssueShare = useCallback(async () => {
    if (!issueId || !userDetails?.EmpID) return

    try {
      await issueShareReq({
        Type: 3,
        PersonID: userDetails.EmpID,
        IssueId: issueId,
        StatusID: 1,
      })
    } catch (error) {
      console.error("Failed to fetch issue share:", error)
    }
  }, [issueShareReq, issueId, userDetails?.EmpID])

  // Effects
  useEffect(() => {
    fetchSulationStats()
  }, [fetchSulationStats, state.updateSulation])

  useEffect(() => {
    fetchSulations()
  }, [fetchSulations, state.updateSulation])

  useEffect(() => {
    fetchIssueShare()
  }, [fetchIssueShare])


  const isCreateMode = state.leftNavState >= 5

  // Event handlers
  const handleLeftNavChange = useCallback(
    (newState: number) => {
      updateState({ leftNavState: newState })
    },
    [updateState],
  )

  const handleTopNavChange = useCallback(
    (newState: number) => {
      updateState({ topNavState: newState })
    },
    [updateState],
  )

  const handleUpdateSulation = useCallback(
    (increment: number) => {
      updateState({ updateSulation: state.updateSulation + increment })
    },
    [updateState, state.updateSulation],
  )

  const handleDeptSearchChange = useCallback(
    (search: string) => {
      updateState({ dptSearch: search })
    },
    [updateState],
  )





  const SolutionsList = useMemo(() => {
    if (sulationsLoading) {
      return (
        <div className="flex items-center justify-center py-8">
          <Loader2 className="h-6 w-6 animate-spin" />
          <span className="ml-2 text-muted-foreground">Loading solutions...</span>
        </div>
      )
    }

    if (sulationsError) {
      return <div className="text-center py-8 text-red-500">Failed to load solutions</div>
    }

    if (!state.sulations || state.sulations.length === 0) {
      return (
        <div className="text-center py-12">
          <p className="text-muted-foreground">No solutions found</p>
        </div>
      )
    }

    return (
      <div className="space-y-4">
        {state.sulations.map((solution: Solution) => (
          <SulationCard
            key={solution.ID || `solution-${Math.random()}`}
            solution={solution}
            setUpdateSulation={handleUpdateSulation}
          />
        ))}
      </div>
    )
  }, [state.sulations, sulationsLoading, sulationsError, handleUpdateSulation])

  if (!issueId) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-muted-foreground">Invalid issue ID</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen w-full bg-background">
      {/* Horizontal Navigation */}
      <HorizontalNavigation isUpdate={isUpdate} setIsUpdate={setIsUpdate} numberOfSulation={statsData} leftNavState={state.leftNavState} setLeftNavState={handleLeftNavChange} sulations={state.sulations} issue={issue} />

      {/* Top Navigation */}
      {!isCreateMode && (
        <header className="sticky top-0 z-10 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b">
          <SulationTopNav
            searchDeptmentWise={searchDepartmentWise}
            setDptSearch={handleDeptSearchChange}
            dptSearch={state.dptSearch}
            updateSulation={state.updateSulation}
            issueId={issueId}
            topNavState={state.topNavState}
            setTopNavState={handleTopNavChange}
          />
        </header>
      )}

      {/* Page Content */}
      <main className="flex-1">
        {!isCreateMode ? (
          <div className="space-y-6 max-w-7xl mx-auto">
            {/* Content Section */}
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <h3 className="text-xl font-bold">{NAV_LABELS[state.leftNavState] || "Solutions"}</h3>
              </div>
              <Separator />

              {/* Solutions List */}
              {SolutionsList}
            </div>
          </div>
        ) : (
          <div>
            <CreateSulation
              setUpdateSulation={handleUpdateSulation}
              updateSulation={state.updateSulation}
              leftNavState={state.leftNavState}
              setLeftNavState={handleLeftNavChange}
              state={state.leftNavState}
            />
          </div>
        )}
      </main>

    </div>
  )
}

export default NewIssueSolutions
