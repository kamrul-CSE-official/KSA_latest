"use client"

import { type ReactNode, useEffect, useState } from "react"
import { useSelector } from "react-redux"
import { useSearchParams } from "next/navigation"
import { toast } from "sonner"
import { BookOpen, Lock, Search, Trash, UserPlus } from "lucide-react"

import type { RootState } from "@/redux/store"
import { useCreateADocumentMutation, useWorkspaceShareManageMutation } from "@/redux/services/ideaApi"
import { useGetEmpMutation } from "@/redux/services/userApi"

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"

type ShareType = "public" | "private"
type User = {
  EmpID: string
  Name: string
  Image: string
  DesignationName: string
  Department?: string
  Section?: string
}

type SharedUser = {
  EMP_ID: string
  PersonName: string
  ITEM_IMAGE: string
}

const Share = ({ children }: { children: ReactNode }) => {
  const [selectedUsers, setSelectedUsers] = useState<SharedUser[]>([])
  const [refreshTrigger, setRefreshTrigger] = useState(true)
  const [shareType, setShareType] = useState<ShareType>("private")
  const [searchQuery, setSearchQuery] = useState("")

  const loggedInUser = useSelector((state: RootState) => state.user.userData)
  const [re, {reset}] = useCreateADocumentMutation()
  const searchParams = useSearchParams()
  const workspaceId = searchParams.get("workspaceId")

  const [shareReq, { isLoading: shareLoading, isSuccess: shareSuccess }] = useWorkspaceShareManageMutation()
  const [requestForSuggestUser, { isLoading: suggestPeopleLoading, data: suggestPeopleData }] = useGetEmpMutation()

  const userDetails = useSelector((state:RootState)=> state.user.userData);

  // Fetch suggested users on component mount
  useEffect(() => {
    if (loggedInUser?.SectionName || loggedInUser?.SubCostCenter) {
      requestForSuggestUser({
        EmpID: "",
        Name: "",
        SectionID: userDetails?.SectionID || "",
        DepartmentID: "",
        Page: 1,
        Limit: 6,
      })
      reset();
    }
  }, [loggedInUser, requestForSuggestUser])
  console.log("USER DETAILS::::::: ", userDetails)

  // Fetch shared users whenever the workspace ID changes or after updates
  useEffect(() => {
    const fetchSharedPersons = async () => {
      if (!workspaceId) return

      try {
        const req = await shareReq({ Type: 3, WorkSpaceID: workspaceId })
        if (req?.data) {
          setSelectedUsers(req.data)
          reset();
        }
      } catch (error) {
        toast.error("Failed to fetch shared users")
      }
    }

    fetchSharedPersons()
  }, [workspaceId, shareReq, refreshTrigger])

  // Handle search input changes
  const handleSearch = (query: string) => {
    setSearchQuery(query)

    requestForSuggestUser({
      EmpID: isNaN(Number(query)) ? "" : query,
      Name: isNaN(Number(query)) ? query : "",
      SectionID: "",
      DepartmentID: "",
      Page: 1,
      Limit: 6,
    })
  }

  // Handle sharing type changes (public/private)
  const handleShareTypeChange = async (type: ShareType) => {
    if (!workspaceId) {
      toast.error("Workspace ID is missing!")
      return
    }

    setShareType(type)

    try {
      await shareReq({
        Type: 4,
        ShareTypeID: type === "public" ? 1 : 2,
        WorkSpaceID: Number(workspaceId),
      })
      reset();
      toast.success(`Workspace is now ${type}`)
    } catch (error) {
      toast.error(`Failed to set workspace to ${type}`)
    }
  }

  // Handle adding a user to share with
  const handleAddUser = async (user: User) => {
    if (!workspaceId) {
      toast.error("Workspace ID is missing!")
      return
    }

    try {
      await shareReq({
        Type: 1,
        WorkSpaceID: workspaceId,
        PersonId: user.EmpID,
      })
      reset();
      toast.success(`${user.Name} has been added`)
      setRefreshTrigger(!refreshTrigger)
      setSearchQuery("")
    } catch (error) {
      toast.error(`Failed to add ${user.Name}`)
    }
  }

  // Handle removing a user from sharing
  const handleRemoveUser = async (user: SharedUser) => {
    if (!workspaceId) {
      toast.error("Workspace ID is missing!")
      return
    }

    try {
      await shareReq({
        Type: 2,
        WorkSpaceID: workspaceId,
        PersonId: user.EMP_ID,
      })
      reset();
      toast.success(`User has been removed`)
      setRefreshTrigger(!refreshTrigger)
    } catch (error) {
      toast.error("Failed to remove user")
    }
  }

  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="w-full max-w-3xl max-h-[90vh] flex flex-col p-4 md:p-6">
        <DialogHeader>
          <DialogTitle className="text-lg md:text-xl mb-4 flex items-center gap-2">
            <UserPlus className="h-5 w-5" /> Share Workspace 
          </DialogTitle>
        </DialogHeader>

        <Tabs defaultValue="share" className="w-full">
          <TabsList className="grid grid-cols-2 mb-4">
            <TabsTrigger value="share">Share with People</TabsTrigger>
            <TabsTrigger value="visibility">Visibility Settings</TabsTrigger>
          </TabsList>

          <TabsContent value="share" className="space-y-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by name or ID..."
                value={searchQuery}
                onChange={(e) => handleSearch(e.target.value)}
                className="pl-9 w-full"
              />
            </div>

            <div className="overflow-y-auto max-h-[300px] space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {suggestPeopleLoading ? (
                  Array(4)
                    .fill(0)
                    .map((_, i) => (
                      <div key={i} className="flex items-center gap-3 p-3 border rounded-lg">
                        <Skeleton className="w-12 h-12 rounded-full" />
                        <div className="space-y-2">
                          <Skeleton className="h-4 w-32" />
                          <Skeleton className="h-3 w-24" />
                        </div>
                      </div>
                    ))
                ) : suggestPeopleData?.length ? (
                  suggestPeopleData.map((user: User, i: number) => (
                    <div
                      key={i}
                      onClick={() => handleAddUser(user)}
                      className="flex items-center gap-3 p-3 border rounded-lg shadow-sm cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800 transition"
                    >
                      <Avatar className="w-12 h-12 border">
                        <AvatarImage src={`data:image/jpeg;base64,${user.Image}`} alt={user.Name} />
                        <AvatarFallback>{user.Name.substring(0, 2)}</AvatarFallback>
                      </Avatar>
                      <div className="flex flex-col overflow-hidden">
                        <p className="font-medium truncate">{user.Name}</p>
                        <small className="text-muted-foreground">ID: {user.EmpID}</small>
                        <small className="text-muted-foreground truncate">{user.DesignationName}</small>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-center text-muted-foreground col-span-2 py-8">
                    {searchQuery ? "No results found" : "Search for people to share with"}
                  </p>
                )}
              </div>
            </div>

            {selectedUsers.length > 0 && (
              <div className="border-t pt-4">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-semibold">Shared With</h3>
                  <Badge variant="outline">{selectedUsers.length} people</Badge>
                </div>
                <div className="flex flex-wrap gap-2">
                  {selectedUsers.map((user: SharedUser, i: number) => (
                    <TooltipProvider key={i}>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <div className="flex items-center gap-2 border rounded-full pl-1 pr-1 py-1 bg-muted/30">
                            <Avatar className="h-6 w-6">
                              <AvatarImage src={`data:image/jpeg;base64,${user?.ITEM_IMAGE}`} alt={user?.PersonName} />
                              <AvatarFallback>{user?.PersonName?.substring(0, 2)}</AvatarFallback>
                            </Avatar>
                            <span className="text-sm truncate max-w-[100px]">{user?.PersonName}</span>
                            <Button
                              onClick={(e) => {
                                e.stopPropagation()
                                handleRemoveUser(user)
                              }}
                              className="h-6 w-6 rounded-full p-0"
                              size="sm"
                              variant="ghost"
                            >
                              <Trash className="h-3 w-3 text-muted-foreground hover:text-destructive" />
                            </Button>
                          </div>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>{user?.PersonName}</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  ))}
                </div>
              </div>
            )}
          </TabsContent>

          <TabsContent value="visibility" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div
                className={`border rounded-lg p-4 cursor-pointer transition-all ${
                  shareType === "public" ? "ring-2 ring-primary bg-primary/5" : "hover:bg-muted/50"
                }`}
                onClick={() => handleShareTypeChange("public")}
              >
                <div className="flex items-center gap-3 mb-2">
                  <div className="bg-primary/10 p-2 rounded-full">
                    <BookOpen className="h-5 w-5 text-primary" />
                  </div>
                  <h3 className="font-semibold">Public</h3>
                </div>
                <p className="text-sm text-muted-foreground">Anyone in your organization can view this workspace</p>
              </div>

              <div
                className={`border rounded-lg p-4 cursor-pointer transition-all ${
                  shareType === "private" ? "ring-2 ring-primary bg-primary/5" : "hover:bg-muted/50"
                }`}
                onClick={() => handleShareTypeChange("private")}
              >
                <div className="flex items-center gap-3 mb-2">
                  <div className="bg-primary/10 p-2 rounded-full">
                    <Lock className="h-5 w-5 text-primary" />
                  </div>
                  <h3 className="font-semibold">Private</h3>
                </div>
                <p className="text-sm text-muted-foreground">Only people you share with can access this workspace</p>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  )
}

export default Share

